import { forwardRef, useState } from "react";
import { useAppSelector } from "../redux/hooks";

const Comment = forwardRef(({ comment, onDelete, onEdit }, ref) => {
  const isoString = comment.createdAt;
  const date = new Date(isoString);

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: userTimeZone,
  };

  const formattedDate = `${date.toLocaleDateString("en-US", options)} `;

  const authorName = comment.author?.name;
  //   console.log("Comment Author:", authorName);
  const user = useAppSelector((state) => state.user);

  const loggedInUserId = user.user?._id;
  console.log(comment);
  console.log("User in Comment:", user);

  const isUserComment = comment.author?._id === loggedInUserId;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  return (
    <div ref={ref} className="comment-item bg-[#F9FAFB] p-2 rounded mb-4">
      <div className="comment-content flex justify-between mb-2">
        <div className="author-date-div">
          <p className="font-medium">{authorName}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>

        {isUserComment && (
          <div className="edit_delete-div flex gap-2 items-start">
            {isEditing ? (
              <>
                <button
                  onClick={async () => {
                    await onEdit(comment._id, editedText);
                    setIsEditing(false);
                  }}
                  className="text-blue-700 cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditedText(comment.text);
                    setIsEditing(false);
                  }}
                  className="text-red-700 cursor-pointer"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-700 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(comment._id)}
                  className="text-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          className="w-full p-2 border rounded"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
      ) : (
        <p>{comment.text}</p>
      )}
    </div>
  );
});

export default Comment;
