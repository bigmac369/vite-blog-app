import { BrowserRouter as Router, Routes, Route } from "react-router";
import SigninForm from "./pages/Signin";
import SignupForm from "./pages/Signup";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import SingleBlog from "./pages/SingleBlog";
import UserProfile from "./pages/UserProfile";
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
          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/create" element={<CreatePost />} /> */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
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
