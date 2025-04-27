import { useState } from "react";
import axios from "axios";

const SigninForm = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

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
        "http://localhost:5000/api/v1/auth/sign-in",
        { email, password }
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
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <label className="mr-70 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="text"
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
            Login
          </button>

          <div className="text-center mt-3">
            <p className="text-sm">
              Don't have an account yet?{" "}
              <a href="/signup" className="text-blue-500 hover:text-blue-700">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SigninForm;
