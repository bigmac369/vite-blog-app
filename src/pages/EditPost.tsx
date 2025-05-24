import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quillRef = useRef<ReactQuill | null>(null);

  // Fetch post data when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/v1/posts/${id}`,
          {
            withCredentials: true, // Include cookies in the request
          }
        );

        setTitle(response.data.title);
        setSummary(response.data.summary);
        setValue(response.data.content);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch post data");
        setLoading(false);
        console.error("Error fetching post:", err);
      }
    };

    fetchPost();
  }, [id]);

  //   useEffect(() => {
  //     if (quillRef.current) {
  //       quillRef.current.getEditor().setText(value);
  //     }
  //   }, [value]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get plain text (no <p> or formatting)
    const plainText = quillRef.current
      ? quillRef.current.getEditor().getText().trim()
      : "";

    try {
      const data = {
        title,
        summary,
        content: plainText,
      };

      const config = {
        withCredentials: true, // Ensure cookies are sent with the request
      };

      await axios.put(`http://localhost:5000/api/v1/posts/${id}`, data, config);

      console.log("Post updated successfully");
      // Redirect to the post detail page after successful update
      navigate(`/post/${id}`);
    } catch (err) {
      setError("Failed to update post");
      console.error("Error updating post:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <form onSubmit={handleSubmit}>
        <input
          className="bg-amber-200 w-full mb-5 px-2 py-2 border-1 rounded-sm"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="bg-amber-200 w-full mb-5 px-2 py-2 border-1 rounded-sm"
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <ReactQuill
          ref={quillRef}
          className="h-full bg-blue-100 mb-5"
          theme="snow"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          placeholder="Write your post here..."
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-black text-white flex-1 py-4 rounded-sm hover:cursor-pointer"
          >
            Update Post
          </button>
          <button
            type="button"
            onClick={() => navigate(`/post/${id}`)}
            className="bg-gray-300 px-4 py-2 rounded-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
