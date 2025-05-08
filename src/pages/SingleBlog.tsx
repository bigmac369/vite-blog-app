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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{post?.title}</h1>
      <p className="text-gray-500 mb-6 italic">{post?.summary}</p>
      <hr className="mb-6" />
      <div className="prose prose-lg prose-slate">
        <p>{post?.content}</p>
      </div>
    </div>
  );
};

export default SingleBlog;
