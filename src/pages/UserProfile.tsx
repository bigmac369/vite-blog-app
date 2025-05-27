import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import { updateUser } from "../features/user/userSlice";
import UserProfilePost from "../components/UserProfilePost";

const UserProfile = () => {
  //state.user = {user: {...}, loading: false. error: null}
  const user = useAppSelector((state) => state.user.user);
  console.log("User Data:", user);

  const dispatch = useAppDispatch();

  const userId = user?._id;
  console.log("User ID:", userId);

  const [username, setUsername] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [userPosts, setUserPosts] = useState([]); // Assuming you might want to fetch user posts later

  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch user posts if needed
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/posts/user/${userId}`,
          { withCredentials: true }
        );
        console.log("User Posts:", res.data);
        setUserPosts(res.data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If the click is outside the modal, close it
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    }

    // Attach listener only when modal is open
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up listener on unmount or when modal closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, setIsModalOpen]);

  console.log("User Profile:", username);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically dispatch an action to update the user profile
    try {
      const data = {
        username,
        email,
      };
      const config = {
        withCredentials: true, // Ensure cookies are sent with the request
      };
      const res = await axios.put(
        `http://localhost:5000/api/v1/users/${userId}`,
        data,
        config
      );

      console.log("Profile updated successfully:", res.data);

      dispatch(
        updateUser({
          ...res.data.data,
          name: res.data.data.name,
          email: res.data.data.email,
        })
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        password,
        newPassword,
        confirmPassword,
      };
      const res = await axios.put(
        `http://localhost:5000/api/v1/users/${userId}`,
        data,
        {
          withCredentials: true,
        }
      );
      // handle success
      console.log("Password updated successfully:", res.data);
      setIsModalOpen(false);
      // Optionally, you can reset the password fields
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      // handle error
      console.error("Error updating password:", err);
    }
  };

  // Function to handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/posts/${postId}`, {
        withCredentials: true,
      });
      setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error(
        "Failed to delete post:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <>
      <div className="container max-w-[800px] mx-auto mt-5 mb-5">
        <div className="profile-card p-5 rounded-lg bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] mb-7">
          <div className="profile-header flex justify-between items-center mb-8 pb-5 border-b-2 border-b-[#eee]">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#F39C12] px-4 py-1 rounded-sm text-white cursor-pointer"
            >
              Reset Password
            </button>
          </div>
          {/* username and email form */}
          <form onSubmit={handleSubmit}>
            <div className="form-row flex justify-between gap-5">
              <div className="form-group flex-1 mb-5">
                <label className="block" htmlFor="username">
                  Username
                </label>
                <input
                  className="w-full border-2 border-[#ddd] rounded-sm p-3 text-sm"
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group flex-1 mb-5">
                <label className="block" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full border-2 border-[#ddd] rounded-sm p-3 text-sm"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <button className="bg-[#3498DB] px-4 py-1 rounded-sm text-white cursor-pointer">
              Update Profile
            </button>
          </form>
        </div>

        <div className="blog-posts-section p-5 rounded-lg bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
          <div className="my-post-header flex justify-between items-center mb-8 pb-5 border-b-2 border-b-[#eee]">
            <h2 className="text-2xl font-bold">My Posts</h2>
            <Link
              to="/create"
              className="bg-[#3498DB] px-4 py-1 rounded-sm text-white cursor-pointer"
            >
              Create New Post
            </Link>
          </div>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <UserProfilePost key={post._id} post={post} onDelete={handleDeletePost} />
            ))
          ) : (
            <p className="text-gray-500">You have no posts yet.</p>
          )}

          {/* Add more UserProfilePost components as needed */}
        </div>
      </div>
      {/* Reset Password Modal  */}
      {isModalOpen && (
        <>
          {/* Backdrop Overlay */}
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50"></div>

          <div
            ref={modalRef}
            id="passwordModal"
            className="modal fixed bg-white top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] z-[100] p-[30px] rounded-sm w-[90%] max-w-[500px]"
          >
            <div className="modal-content">
              <div className="modal-header flex justify-between items-center mb-5 border-b border-b-[#eee] pb-5">
                <h3>Reset Password</h3>
                <button
                  className="close-btn text-2xl cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <form id="passwordForm" onSubmit={handlePasswordSubmit}>
                <div className="form-group mb-5">
                  <label className="block mb-1" htmlFor="currentPassword">
                    Current Password
                  </label>

                  <input
                    className="w-full border-2 border-[#ddd] rounded-sm p-3 text-sm"
                    type="text"
                    id="currentPassword"
                    name="currentPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-5">
                  <label className="block mb-1" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    className="w-full border-2 border-[#ddd] rounded-sm p-3 text-sm"
                    type="tex"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-5">
                  <label className="block mb-1" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    className="w-full border-2 border-[#ddd] rounded-sm p-3 text-sm"
                    type="text"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {/* style="display: flex; gap: 10px; justify-content: flex-end;" */}
                <div className="flex justify-end gap-3">
                  {/* style="background: #95a5a6; color: white;" */}
                  <button
                    type="button"
                    className="btn bg-[#95A5A6] px-5 py-2.5 rounded-sm text-white cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-[#3498DB] px-5 py-2.5 rounded-sm text-white cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserProfile;
