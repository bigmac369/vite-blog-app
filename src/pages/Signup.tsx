import axios from "axios";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const signupSchema = z.object({
  username: z.string().min(3, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    // Handle signup logic here, e.g., send data to the server
    const { username, email, password } = data;
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
        className="bg-white border w-[400px] "
        onSubmit={handleSubmit(onSubmit)}
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
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-xs ">{errors.username.message}</p>
          )}
          <label className="mr-70 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
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
            Sign Up
          </button>

          <div className="text-center mt-3">
            <p className="text-sm">
              Already have an account?{" "}
              <a href="/signin" className="text-blue-500 hover:text-blue-700">
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
