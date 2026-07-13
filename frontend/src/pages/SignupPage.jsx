import { useState } from "react";
import { Link } from "react-router";
import { MessageCircle } from "lucide-react";
import { fetchInstance } from "../lib/api";
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

    const queryClient = useQueryClient()

    const {mutate:signupMutation, isPending, error} = useMutation({

      mutationFn: async (signupData) => {

        const response = await fetchInstance("/auth/signup", {
        method: "POST",
        body: JSON.stringify(signupData),
      });

      console.log(response);
      return response
      },

      onSuccess: (response) => {
    console.log(response);

    toast.success("Account created successfully!");

    queryClient.invalidateQueries({
      queryKey: ["authUser"],
    });
  },

  onError: (error) => {
    toast.error(error.message);
  },
    })

  const handleSignup = async (e) => {
    e.preventDefault();

    signupMutation(signupData)
    
    setSignupData({
      fullName: "",
    email: "",
    password: "",
    })
  };

  const handleChange = (e) => {
    setSignupData({
      ...signupData,
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
              <h1 className="text-3xl font-bold">StreamoPhone</h1>
              <p className="text-sm text-base-content/70">
                AI Collaboration Platform
              </p>          
            </div>
               
          </div>
           {error && (
  <div className="alert alert-error mb-4">
    <span>{error.message}</span>
  </div>
)}

          <h2 className="text-2xl font-semibold mb-2">
            Create your account
          </h2>

          <p className="text-base-content/60 mb-8">
            Join thousands of teams collaborating smarter.
          </p>

          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >
            <div>
              <label className="label">
                <span className="label-text">
                  Full Name
                </span>
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                className="input input-bordered w-full bg-base-300"
                value={signupData.fullName}
                onChange={handleChange}
              />
            </div>

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
                value={signupData.email}
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
                value={signupData.password}
                onChange={handleChange}
              />
            </div>

            <button
              className="btn btn-primary w-full mt-4"
              disabled = {isPending}
            >
              {isPending
        ? "Creating..."
        : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-8 text-base-content/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Right */}

        <div className="hidden lg:flex items-center justify-center bg-base-300 p-10">
          <div className="max-w-md p-8">
    {/* Illustration */}
    <div className="relative aspect-square max-w-sm mx-auto">
      <img
        src="/storyset01.svg"
        alt="AI Collaboration Illustration"
        className="w-full h-full object-contain"
      />
    </div>

    {/* Content */}
    <div className="text-center space-y-4 mt-8">
      <h2 className="text-3xl font-bold text-base-content">
        Collaborate Smarter
      </h2>

      <p className="text-base-content/70 leading-relaxed">
        Connect with your teammates worldwide through secure messaging,
        HD video meetings, file sharing, and AI-powered
        collaboration—all in one workspace.
      </p>
      </div>
      </div>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;