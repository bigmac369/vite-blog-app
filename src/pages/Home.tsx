import Blogs from "./Blogs";

const Home = () => {
  return (
    <div className="min-h-screen bg-red-200 p-8  mx-auto container">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
      <Blogs />
    </div>
  );
};

export default Home;
