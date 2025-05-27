import { useNavigate } from "react-router";

const UserProfilePost = ({ post, onDelete }) => {

  const navigate = useNavigate();

  const { title, summary, createdAt, _id } = post;
  return (
    <div className="postContainer">
      <div className="post-item border border-[#eee] p-5 rounded-sm">
        <div className="post-header flex justify-between mb-2">
          <div>
            <h3 className="post-title font-bold text-xl">{title}</h3>
            <div className="post-date text-[#7f8c8d]">
              Published on {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="post-action flex justify-center items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation(); // stop click from reaching Link
                // handle edit logic here
                navigate(`/edit-post/${_id}`);
              }}
              className="bg-[#3498DB] text-white px-2 rounded-sm cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(_id)}
              className="bg-[#E74C3C] text-white px-2 rounded-sm cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="post-excerpt bg-[#F8F9FA] p-3.5 border-l-4 border-l-[#3498db]">
          {summary}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePost;
