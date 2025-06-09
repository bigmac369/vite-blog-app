import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
// import axios from "axios";
import api from "../api/axiosSetup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [value, setValue] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quillRef = useRef<ReactQuill | null>(null);

  // Fetch post data when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `http://localhost:5000/api/v1/posts/${id}`,
          {
            withCredentials: true, // Include cookies in the request
          }
        );
        console.log("Fetched post:", response.data);

        setTitle(response.data.title);
        setSummary(response.data.summary);
        setValue(response.data.content);
        setPreviewImage(response.data.imageurl || null);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch post data");
        setLoading(false);
        console.error("Error fetching post:", err);
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreviewImage(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Get plain text (no <p> or formatting)

    try {
      const plainText = quillRef.current
        ? quillRef.current.getEditor().getText().trim()
        : "";

      const data = {
        title,
        summary,
        content: plainText,
      };

      const config = {
        withCredentials: true, // Ensure cookies are sent with the request
      };

      await api.put(`http://localhost:5000/api/v1/posts/${id}`, data, config);

      if (image) {
        setUploadProgress("Uploading new image...");

        const storageRef = ref(storage, `posts/${id}-${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const imageUrl = await getDownloadURL(snapshot.ref);

        setUploadProgress("Updating post with image...");

        await api.patch(
          `http://localhost:5000/api/v1/posts/${id}/image`,
          { imageurl: imageUrl },
          { withCredentials: true }
        );
      }

      setUploadProgress("Post updated successfully!");

      setTimeout(() => {
        setUploadProgress("");
        navigate(`/post/${id}`);
      }, 2000);
      // Redirect to the post detail page after successful update
    } catch (err) {
      setError("Failed to update post");
      console.error("Error updating post:", err);
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`http://localhost:5000/api/v1/posts/${id}`, {
        withCredentials: true, // send cookies
      });

      console.log("Post deleted successfully");
      navigate("/profile"); // or wherever you want to redirect after delete
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Something went wrong while deleting the post.");
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
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
        <button
          onClick={handleDeletePost}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>

      <form onSubmit={handleUpdate}>
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

        {/* Image upload input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-5"
          disabled={loading}
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mb-5 w-full max-w-full h-auto max-h-96 border object-contain"
          />
        )}

        <ReactQuill
          ref={quillRef}
          className="h-full bg-blue-100 mb-5"
          theme="snow"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          placeholder="Write your post here..."
        />

        {/* Progress indicator */}
        {uploadProgress && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-sm">
            {uploadProgress}
          </div>
        )}

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
