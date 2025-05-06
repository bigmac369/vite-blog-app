import BlogPost from "../components/BlogPost";
import SearchBlog from "../components/SearchBlog";
import { useEffect, useState } from "react";

const Blogs = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/v1/posts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
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

      <div className="flex flex-wrap gap-5 justify-center">
        <BlogPost />
        <BlogPost />
        <BlogPost />
        <BlogPost />
      </div>
      {posts.map((post) => (
        <div key={post._id} className="bg-white p-4 rounded shadow-md mb-4">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.summary}</p>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Blogs;
