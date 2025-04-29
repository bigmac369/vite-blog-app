import BlogPost from "../components/BlogPost";
import SearchBlog from "../components/SearchBlog";

const Blogs = () => {
  return (
    <div className="mt-6 bg-amber-500 container">
      <SearchBlog />

      <div className="flex flex-wrap gap-5 justify-center">
        <BlogPost />
        <BlogPost />
        <BlogPost />
        <BlogPost />
      </div>
    </div>
  );
};

export default Blogs;
