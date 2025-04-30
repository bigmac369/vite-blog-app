import { NavLink } from "react-router";

const Navbar = () => {
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
        <NavLink to="signin">Login</NavLink>
        {/* <NavLink to="signup">Sign up</NavLink> */}
      </div>
    </nav>
  );
};

export default Navbar;
