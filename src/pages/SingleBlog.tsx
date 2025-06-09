import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Comment from "../components/Comment";
import { useAppSelector } from "../redux/hooks";

interface CommentType {
  _id: string;
  text: string;
  author: string; // Replace 'any' with your actual author type if available
  postId: string;
  // Add other fields as needed
}
const SingleBlog = () => {
  const user = useAppSelector((state) => state.user);

  console.log(user);
  const { id } = useParams(); // assuming you're using react-router
  // console.log(id);
  const navigate = useNavigate();

  // console.log(user);
  const [post, setPost] = useState(null);
  console.log(user.user);
  console.log(post?.imageurl);
  const isOwner = user.user && user.user._id === post?.author._id;

  const [comments, setComments] = useState<CommentType[]>([]);
  const numberOfComments = comments.length;
  const [commentText, setCommentText] = useState("");

  // console.log(comments);

  const newCommentRef = useRef<HTMLTextAreaElement>(null);

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
  }, [id]); //only refetch when id change, means view another post

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/comments/post/${id}`,
          {
            withCredentials: true,
          }
        );

        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/comments/createComment`,
        {
          text: commentText,
          // author: user.user?._id, //stop sending author from the frontend
          postId: id, // Post ID to which the comment belongs
        },
        { withCredentials: true }
      );
      console.log(response);

      setComments((prevComments) => [...prevComments, response.data]);

      setTimeout(() => {
        newCommentRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Delay for rendering to complete

      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/comments/${commentId}`, {
        withCredentials: true,
      });
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = async (commentId: string, newText: string) => {
    if (!newText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/comments/${commentId}`,
        { text: newText },
        { withCredentials: true }
      );
      console.log(comments);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? response.data : comment
        )
      );
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/v1/posts/${post._id}`, {
        withCredentials: true,
      });

      // Redirect to home or blog list after successful deletion
      navigate("/");
    } catch (error) {
      console.error(
        "Failed to delete post:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="page-container max-w-3xl mx-auto p-6 min-h-screen">
      {/* post container */}
      <div className="post-container mb-8">
        <div className="title-summary-container flex">
          <div>
            <h1 className="text-3xl font-bold mb-2">{post?.title}</h1>
            <p
              // style={
              //   {
              //     wordWrap: "break-word",
              //     wordBreak: "break-word",
              //     overflowWrap: "break-word",
              //     maxWidth: "100%",
              //     whiteSpace: "pre-wrap",
              //   }
              // }
              className="text-gray-500 mb-6 italic [word-break:break-word]"
            >
              {post?.summary}
            </p>
          </div>
          {isOwner && (
            <div className="flex items-start gap-4 ml-auto">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // stop click from reaching Link
                  // handle edit logic here
                  navigate(`/edit-post/${post._id}`);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer"
                onClick={handleDeletePost}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {post?.imageurl && (
          <div className="featured-image-container mb-6">
            <img
              src={post?.imageurl}
              alt={post.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        <hr className="mb-6" />
        <div className="prose prose-lg prose-slate">
          <p className="break-words">{post?.content}</p>
        </div>
      </div>

      {/* comments section */}
      <div className="comments-section">
        <h2 className="text-2xl font-medium mb-4">
          Comments ({numberOfComments})
        </h2>
        {user.user ? (
          <div className="mb-8">
            <div className="mb-4">
              <textarea
                className="border border-gray-300 rounded-lg min-h-[100px] p-3 w-full"
                placeholder="Add a comment..."
                name=""
                id=""
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white transition-colors rounded cursor-pointer"
              onClick={handleAddComment}
            >
              Add Comment
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mb-5">Please log in to comment.</p>
        )}
        {/* Example Comment */}
        <div className="comment-list-container">
          {comments.map((comment, index) => (
            <Comment
              key={comment._id}
              comment={comment}
              ref={index === comments.length - 1 ? newCommentRef : null}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
