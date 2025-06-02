import { useNavigate, Link } from "react-router";

const UserProfilePost = ({ post, onDelete }) => {
  const navigate = useNavigate();

  const { title, summary, createdAt, _id } = post;
  return (
    <div className="postContainer">
      <Link
        to={`/post/${post._id}`}
        className="post-item border border-[#eee] p-5 rounded-sm block mb-3"
      >
        <div className="post-header flex justify-between mb-2">
          <div>
            <h3 className="post-title font-bold text-xl">{title}</h3>
            <div className="post-date text-[#7f8c8d]">
              Published on {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="post-action flex justify-center items-start gap-3">
            <button
              onClick={(e) => {
                e.preventDefault(); // prevent default link behavior
                e.stopPropagation(); // stop click from reaching Link
                // handle edit logic here
                navigate(`/edit-post/${_id}`);
              }}
              className="bg-[#3498DB] hover:bg-blue-600 transition-colors text-white px-2 rounded-sm cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.preventDefault(); // prevent default link behavior
                e.stopPropagation(); // stop click from reaching Link
                onDelete(_id);
              }}
              className="bg-[#E74C3C] hover:bg-red-600 transition-colors text-white px-2 rounded-sm cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="post-excerpt bg-[#F8F9FA] p-3.5 border-l-4 border-l-[#3498db] break-words">
          {summary}
        </div>
      </Link>
    </div>
  );
};

export default UserProfilePost;
