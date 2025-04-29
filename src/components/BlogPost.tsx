const BlogPost = () => {
  return (
    <div className="border w-[300px] rounded-xl overflow-hidden cursor-pointer">
      <img
        className="w-full h-[150px]"
        src="https://media.istockphoto.com/id/471926619/photo/moraine-lake-at-sunrise-banff-national-park-canada.jpg?s=612x612&w=0&k=20&c=mujiCtVk5QA697SD3d8V8BGmd91-8HlxCNHkolEA0Bo="
        alt=""
      />
      <div className="content-div p-4 bg-white">
        <div className="">
          <h2 className="bg-blue-200 rounded-2xl inline-block p-1 px-2 text-[0.6rem] mb-2">
            TECHNOLOGY
          </h2>
          <h1 className="font-bold mb-4">
            Why is the Tesla Cybertruck designed the way it is?
          </h1>
          <p className="text-sm">
            An exploration into the truck's polarising design
          </p>
        </div>
        <div className="mt-10 flex items-center">
          <img
            className="h-10 w-10 rounded-full "
            src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?cs=srgb&dl=pexels-sulimansallehi-1704488.jpg&fm=jpg"
            alt=""
          />
          <div className="ml-3">
            <p className="font-medium">Kanna Chan</p>
            <p className="font-light">2h ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
