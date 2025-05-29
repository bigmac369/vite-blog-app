import { Link } from "react-router";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router";
import { formatDistanceToNow, format, differenceInDays } from "date-fns";

const BlogPost = ({ post, onDelete }) => {
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.user);

  const isOwner = user && user._id === post.author._id;

  const createdAt = new Date(post.createdAt);
  // const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  const formatPostTime = (dateCreated) => {
    const createdDate = new Date(dateCreated);
    const daysDifference = differenceInDays(new Date(), createdDate);

    if (daysDifference < 7) {
      return formatDistanceToNow(createdDate, { addSuffix: true });
    } else {
      return format(createdDate, "MMM d, yyyy");
    }
  };

  return (
    <div className="border w-[300px] rounded-xl overflow-hidden flex flex-col">
      <Link to={`/post/${post._id}`}>
        <img
          className="w-full h-[150px]"
          src="https://media.istockphoto.com/id/471926619/photo/moraine-lake-at-sunrise-banff-national-park-canada.jpg?s=612x612&w=0&k=20&c=mujiCtVk5QA697SD3d8V8BGmd91-8HlxCNHkolEA0Bo="
          alt=""
        />
      </Link>

      <div className="content-div p-4 bg-white h-full flex flex-col justify-between">
        <div className="">
          <div className="flex justify-between ">
            <h2 className="bg-blue-200 rounded-2xl inline-block p-1 px-2 text-[0.6rem] mb-2">
              TECHNOLOGY
            </h2>

            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // stop click from reaching Link
                    // handle edit logic here
                    navigate(`/edit-post/${post._id}`);
                  }}
                  className="bg-blue-300 text-[0.6rem] rounded-2xl px-3 cursor-pointer"
                >
                  edit
                </button>
                <button
                  onClick={() => onDelete(post._id)}
                  className="bg-red-500 text-[0.6rem] rounded-2xl px-2 cursor-pointer"
                >
                  delete
                </button>
              </div>
            )}
          </div>

          <h1 className="font-bold mb-4">{post.title}</h1>
          <p className="text-sm">{post.summary}</p>
        </div>
        <div className="mt-5 flex items-center">
          <img
            className="h-10 w-10 rounded-full "
            src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?cs=srgb&dl=pexels-sulimansallehi-1704488.jpg&fm=jpg"
            alt=""
          />
          <div className="ml-3">
            <p className="font-medium">{post.author.name}</p>
            <p className="font-light">{formatPostTime(createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
