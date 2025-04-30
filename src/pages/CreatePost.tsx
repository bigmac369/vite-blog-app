import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 min-h-screen flex flex-col ">
      <form className="" onSubmit={handleSubmit}>
        <input
          className="bg-amber-200 w-full mb-5 px-2 py-2 border-1 rounded-sm"
          type="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="bg-amber-200 w-full mb-5 px-2 py-2 border-1 rounded-sm"
          type="summary"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <ReactQuill
          className="h-full bg-blue-100 mb-5"
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
