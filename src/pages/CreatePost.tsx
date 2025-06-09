import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api/axiosSetup";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Adjust the import path as necessary

import { FieldValues, useForm } from "react-hook-form";

const CreatePost = () => {
  // const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
    // getValues,
  } = useForm();

  const quillRef = useRef<ReactQuill | null>(null);

  // Watch the image input to update the preview
  const watchImage = watch("image");

  useEffect(() => {
    const file = watchImage?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  }, [watchImage]);

  const onSubmit = async (data: FieldValues) => {
    // Get plain text (no <p> or formatting)
    setIsLoading(true);
    const { title, summary } = data;

    const plainText = quillRef.current
      ? quillRef.current.getEditor().getText().trim()
      : "";

    try {
      const postData = {
        title,
        summary,
        content: plainText,
      };
      const config = {
        withCredentials: true, // Ensure cookies are sent with the request
      };

      const res = await api.post(
        "http://localhost:5000/api/v1/posts",
        postData,
        config
      );
      console.log("Post created successfully:", res);

      const postId = res.data._id;

      // Step 2: Upload image to Firebase if exists
      const imageFile = data.image?.[0];
      if (imageFile && postId) {
        setUploadProgress("Uploading image...");

        const storageRef = ref(storage, `posts/${postId}-${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
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
      reset(); // Reset form fields
      quillRef.current?.getEditor().setText("");
      navigate(`/post/${postId}`); // Redirect to posts page
    } catch (error) {
      console.error("Error creating post:", error);
      setUploadProgress("Error creating post. Please try again.");
    } finally {
      setIsLoading(false);
      // Clear success message after a few seconds
      setTimeout(() => setUploadProgress(""), 3000);
    }
  };

  // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files ? e.target.files[0] : null;
  //   if (file) {
  //     setValue("image", file, {shouldValidate: true});
  //     setPreviewImage(URL.createObjectURL(file));
  //   } else {
  //     setValue("image", null, {shouldValidate: true});
  //     setPreviewImage(null);
  //   }
  //   await trigger("image"); // Trigger validation for the image field
  // };

  return (
    <div className="p-6 min-h-screen flex flex-col ">
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 5,
              message: "Title must be at least 5 characters",
            },
          })}
          className="bg-gray-200 w-full mb-2 px-2 py-2 border-1 rounded-sm"
          type="text"
          placeholder="Title"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-red-500 mb-2">{`${errors.title.message}`}</p>
        )}
        <input
          {...register("summary", {
            required: "Summary is required",
            minLength: {
              value: 10,
              message: "Summary must be at least 10 characters",
            },
          })}
          className="bg-gray-200 w-full mb-5 px-2 py-2 border-1 rounded-sm"
          type="text"
          placeholder="Summary"
          disabled={isSubmitting}
        />
        {errors.summary && (
          <p className="text-red-500 mb-2">{`${errors.summary.message}`}</p>
        )}

        {/* Image upload input */}
        <input
          {...register("image", {
            required: "Image is required",
          })}
          type="file"
          accept="image/*"
          className="mb-5"
          disabled={isSubmitting}
        />
        {errors.image && (
          <p className="text-red-500 mb-2">{`${errors.image.message}`}</p>
        )}
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
          placeholder="Write your post here..."
          onChange={(content) => setValue("content", content)}
        />

        {/* Progress indicator */}
        {uploadProgress && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-sm">
            {uploadProgress}
          </div>
        )}
        <button
          className={`w-full py-4 rounded-sm ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 cursor-pointer"
          }`}
          disabled={isSubmitting || isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner" /> Creating Post
            </>
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
