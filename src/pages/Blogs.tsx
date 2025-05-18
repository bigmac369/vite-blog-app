import BlogPost from "../components/BlogPost";
import SearchBlog from "../components/SearchBlog";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const Blogs = () => {
  const [posts, setPosts] = useState([]);

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error(
        "Failed to delete post:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/posts", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="mt-6 bg-amber-500 container">
      <SearchBlog />
      <div className="flex flex-wrap gap-5 justify-center ">
        {/* <BlogPost />
        <BlogPost />
        <BlogPost />
        <BlogPost /> */}
        {posts.map((post) => (
          <BlogPost key={post._id} post={post} onDelete={handleDeletePost} />
        ))}
      </div>
    </div>
  );
};

export default Blogs;

{
  /* <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="bg-white p-4 rounded shadow-md mb-4 w-80 h-80 block overflow-hidden"
          >
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p>{post.summary}</p>
            <p>{post.content}</p>
          </Link> */
}
