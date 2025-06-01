import { useState, useRef } from "react";
// import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api/axiosSetup";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [value, setValue] = useState("");
  // http://localhost:5000/api/v1/posts

  const quillRef = useRef<ReactQuill | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get plain text (no <p> or formatting)
    const plainText = quillRef.current
      ? quillRef.current.getEditor().getText().trim()
      : "";

    try {
      // const token = localStorage.getItem("token");
      const data = {
        title,
        summary,
        content: plainText,
      };
      const config = {
        withCredentials: true, // Ensure cookies are sent with the request
        // headers: {
        //   Authorization: `Bearer ${token}`, // Include the token in the headers
        //   "Content-Type": "application/json",
        // },
      };
      // console.log("Request Config:", config);

      const res = await api.post(
        "http://localhost:5000/api/v1/posts",
        data,
        config
      );
      console.log("Post created successfully:", res);
      setTitle(""); // Clear the title input after successful submission
      setSummary(""); // Clear the summary input after successful submission
      setValue(""); // Clear the editor after successful submission
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col ">
      <form className="" onSubmit={handleSubmit}>
        <input
          className="bg-gray-200 w-full mb-5 px-2 py-2 border-1 rounded-sm"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="bg-gray-200 w-full mb-5 px-2 py-2 border-1 rounded-sm"
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <ReactQuill
          ref={quillRef}
          className="bg-blue-100 mb-5"
          theme="snow"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          placeholder="Write your post here..."
        />
        <button className="bg-black text-white w-full py-4 rounded-sm hover:cursor-pointer">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
