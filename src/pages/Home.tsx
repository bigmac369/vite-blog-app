import Blogs from "./Blogs";
import TestUpload from "../components/TestUpload";

const Home = () => {
  return (
    <div className="min-h-screen bg-red-200 p-8  mx-auto container">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
      <h2>Test Upload</h2>
      <TestUpload />
      <Blogs />
    </div>
  );
};

export default Home;
