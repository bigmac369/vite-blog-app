import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

const SingleBlog = () => {
  const { id } = useParams(); // assuming you're using react-router
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/posts/${id}`,
          {
            withCredentials: true,
          }
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <div className="page-container max-w-3xl mx-auto p-6 min-h-screen">
      {/* post container */}
      <div className="post-container mb-8">
        <div className="title-summary-container flex">
          <div>
            <h1 className="text-3xl font-bold mb-2">{post?.title}</h1>
            <p className="text-gray-500 mb-6 italic">{post?.summary}</p>
          </div>
          <div className="flex items-start gap-4 ml-auto">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer">
              Edit
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer">
              Delete
            </button>
          </div>
        </div>

        <hr className="mb-6" />
        <div className="prose prose-lg prose-slate">
          <p>{post?.content}</p>
        </div>
      </div>

      {/* comments section */}
      <div className="comments-section">
        <h2 className="text-2xl font-medium mb-4">Comments</h2>
        <div className="mb-8">
          <div className="mb-4">
            <textarea
              className="border border-gray-300 rounded-lg min-h-[100px] p-3 w-full"
              name=""
              id=""
            ></textarea>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white transition-colors rounded cursor-pointer">
            Add Comment
          </button>
        </div>
        {/* Example Comment */}
        <div className="comment-list-container">
          <div className="comment-item bg-[#F9FAFB] p-2 rounded">
            <div className="comment-content flex justify-between mb-2">
              <div className="author-date-div">
                <p className="font-medium">Author name</p>
                <p className="text-sm text-gray-500">Date</p>
              </div>
              <div className="edit_delete-div flex gap-2 items-start">
                <button className="text-blue-700 cursor-pointer">Edit</button>
                <button className="text-red-700 cursor-pointer">Delete</button>
              </div>
            </div>
            <p>
              Great article! The examples really helped me understand hooks
              better. I've been struggling with useEffect dependencies, and your
              explanation cleared things up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
