import { useEffect } from "react";
import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Link, useNavigate } from "react-router";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const SigninForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ✅ Only for detecting login success
  const user = useAppSelector((state) => state.user.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    // Handle signup logic here, e.g., send data to the server
    const { email, password } = data;
    try {
      dispatch(loginStart());
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/sign-in",
        { email, password },
        {
          withCredentials: true, // Ensure cookies are sent with the request
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userData = response.data.data.user;
      console.log("User data:", userData);

      dispatch(loginSuccess(userData));

      navigate("/");

      console.log("Signin success:", userData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch(loginFailure(errorMessage));
        console.error("Signin error:", errorMessage);
      } else {
        console.error("Signin error:", error);
      }
    }
  };
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <form
        className="bg-white border w-[400px] h-[400px]"
        onSubmit={handleSubmit(onSubmit)}
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
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          <label className="mr-63 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="border p-2 mb-4 w-[80%]"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          <button className="bg-blue-500 text-white p-2 rounded w-[80%]">
            Login
          </button>

          <div className="text-center mt-3">
            <p className="text-sm">
              Don't have an account yet?{" "}
              <Link to="/signup" className="text-blue-500 hover:text-blue-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SigninForm;
