import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api/axiosSetup";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Adjust the import path as necessary

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [value, setValue] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const quillRef = useRef<ReactQuill | null>(null);

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

      const res = await api.post(
        "http://localhost:5000/api/v1/posts",
        data,
        config
      );
      console.log("Post created successfully:", res);

      const postId = res.data._id;

      // Step 2: Upload image to Firebase if exists
      if (image && postId) {
        setUploadProgress("Uploading image...");

        const storageRef = ref(storage, `posts/${postId}-${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const imageUrl = await getDownloadURL(snapshot.ref);

        setUploadProgress("Updating post with image...");

        // Step 3: Update post with image URL
        await api.patch(
          `http://localhost:5000/api/v1/posts/${postId}/image`,
          { imageurl: imageUrl },
          config
        );

        console.log("Image uploaded and post updated successfully");
      }
      setTitle(""); // Clear the title input after successful submission
      setSummary(""); // Clear the summary input after successful submission
      setValue(""); // Clear the editor after successful submission
    } catch (error) {
      console.error("Error creating post:", error);
      setUploadProgress("Error creating post. Please try again.");
    } finally {
      setIsLoading(false);
      // Clear success message after a few seconds
      setTimeout(() => setUploadProgress(""), 3000);
    }
  };

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

  return (
    <div className="p-6 min-h-screen flex flex-col ">
      <form className="" onSubmit={handleSubmit}>
        <input
          className="bg-gray-200 w-full mb-5 px-2 py-2 border-1 rounded-sm"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        <input
          className="bg-gray-200 w-full mb-5 px-2 py-2 border-1 rounded-sm"
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          disabled={isLoading}
        />

        {/* Image upload input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-5"
          disabled={isLoading}
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
          className="bg-blue-100 mb-5"
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
        <button className="bg-black text-white w-full py-4 rounded-sm hover:cursor-pointer">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
