import { useState } from "react";
import { Link } from "react-router";
import { MessageCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchInstance } from "../lib/api";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (loginData) => {
      return await fetchInstance("/auth/signin", {
        method: "POST",
        body: JSON.stringify(loginData),
      });
    },

    onSuccess: (response) => {
      console.log(response);

      toast.success(response.message || "Login Successful");

      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-5">
      <div className="w-full max-w-6xl bg-base-200 rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* Left */}

        <div className="p-8 md:p-14 flex flex-col justify-center">

          <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary w-12 h-12 rounded-2xl flex items-center justify-center">
              <MessageCircle className="text-primary-content" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                StreamoPhone
              </h1>

              <p className="text-sm text-base-content/70">
                AI Collaboration Platform
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-2">
            Welcome Back
          </h2>

          <p className="text-base-content/60 mb-8">
            Sign in to continue collaborating with your team.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="label">
                <span className="label-text">
                  Email
                </span>
              </label>

              <input
                type="email"
                name="email"
                placeholder="john@gmail.com"
                className="input input-bordered w-full bg-base-300"
                value={loginData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">
                  Password
                </span>
              </label>

              <input
                type="password"
                name="password"
                placeholder="********"
                className="input input-bordered w-full bg-base-300"
                value={loginData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary text-base-300 w-full"
              disabled={isPending}
            >
              {isPending
                ? "Signing In..."
                : "Login"}
            </button>
          </form>

          <p className="text-center mt-8 text-base-content/70">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>

        </div>

        {/* Right */}

        <div className="hidden lg:flex items-center justify-center bg-base-300 p-10">
          <div className="max-w-md p-8">

            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/storyset01.svg"
                alt="Login Illustration"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center space-y-4 mt-8">
              <h2 className="text-3xl font-bold text-base-content">
                Stay Connected
              </h2>

              <p className="text-base-content/70 leading-relaxed">
                Access your conversations, meetings, shared files,
                and AI-powered collaboration tools from anywhere.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;