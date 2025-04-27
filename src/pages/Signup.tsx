import { useState } from "react";
import axios from "axios";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle signup logic here, e.g., send data to the server
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/sign-up",
        { username, email, password }
      );
      console.log("Signup success:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Signup error:", error.response?.data || error.message);
      } else {
        console.error("Signup error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <form
        className="bg-white border w-[400px] h-[400px]"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-4">Signup</h1>
          <label className="mr-63 mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter username"
            className="border p-2 mb-4 w-[80%]"
            value={username}
            onChange={handleUsernameChange}
          />
          <label className="mr-70 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            className="border p-2 mb-4 w-[80%]"
            value={email}
            onChange={handleEmailChange}
          />
          <label className="mr-63 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="border p-2 mb-4 w-[80%]"
            value={password}
            onChange={handlePasswordChange}
          />
          <button className="bg-blue-500 text-white p-2 rounded w-[80%]">
            Sign Up
          </button>

          <div className="text-center mt-3">
            <p className="text-sm">
              Already have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:text-blue-700">
                Log in
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
