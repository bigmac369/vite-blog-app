import { NavLink, Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router";
import axios from "axios";
import { logout } from "../features/user/userSlice";
import { useState } from "react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user.user);
  console.log(user);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/sign-out",
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(logout());
      navigate("/");
      setShowDropdown(false); // Close the dropdown after logout
      console.log("Response data:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Logout error:", errorMessage);
      } else {
        console.error("Logout error:", error);
      }
    }
  };

  return (
    <nav className=" border bg-gray-100 flex p-4">
      <NavLink to="/">Logo nav</NavLink>
      <div className="gap-4 ml-auto mr-4 sm:flex hidden">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            "" + (isActive ? "text-red-500" : "text-gray-700 hover:underline")
          }
        >
          Home
        </NavLink>
        <NavLink to="create">Create Post</NavLink>
        {/* {user ? (
          <button onClick={handleLogout} className="cursor-pointer">
            Logout
          </button>
        ) : (
          <NavLink to="signin">Login</NavLink>
        )} */}
        {user ? (
          <div className="relative">
            <img
              // src={user.avatar || "https://www.gravatar.com/avatar/?d=mp"}
              src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
              className="w-8 h-8 rounded-full cursor-pointer object-cover"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded p-2">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/signin" className="text-blue-600 hover:underline">
            Login
          </NavLink>
        )}
        {/* <NavLink to="signup">Sign up</NavLink> */}
      </div>
    </nav>
  );
};

export default Navbar;
