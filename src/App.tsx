import { BrowserRouter as Router, Routes, Route } from "react-router";
import SigninForm from "./pages/Signin";
import SignupForm from "./pages/Signup";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import SingleBlog from "./pages/SingleBlog";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SigninForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/create" element={<CreatePost />} /> */}
          <Route path="/post/:id" element={<SingleBlog />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

{
  /* <h1>Hello World</h1> */
}
{
  /* <SigninForm />
<SignupForm /> */
}
