import { BrowserRouter as Router, Routes, Route } from "react-router";
import SigninForm from "./pages/Signin";
import SignupForm from "./pages/Signup";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SigninForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/create" element={<CreatePost />} />
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
