import { NavLink } from "react-router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router";
import axios from "axios";
import { logout } from "../features/user/userSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user.user);

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
        {user ? (
          <button onClick={handleLogout} className="cursor-pointer">
            Logout
          </button>
        ) : (
          <NavLink to="signin">Login</NavLink>
        )}

        {/* <NavLink to="signup">Sign up</NavLink> */}
      </div>
    </nav>
  );
};

export default Navbar;
