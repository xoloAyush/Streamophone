import { useState } from "react";
import { MessageCircle, RefreshCw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Globe } from 'lucide-react';
import useAuthUser from "../hooks/userAuthUser";
import { completeOnboarding } from "../lib/api";
// import { createAvatar } from "@dicebear/core";
// import * as adventurer from "@dicebear/adventurer";
// import * as openPeeps from "@dicebear/open-peeps";
import {LANGUAGES} from '../constants/index'
import { useNavigate } from "react-router";

const OnBoardPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  // const authUser = authUser.user
  // console.log(user)
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic:
      authUser?.profilePic ||
  `https://api.dicebear.com/9.x/open-peeps/svg?seed=${crypto.randomUUID()}`

  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,

    onSuccess: () => {
      toast.success("Profile onboarded successfully");

      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });

      navigate('/')
    },

    onError: (error) => {
      toast.error(error.message);
      console.log(error.message)
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const generateAvatar = () => {
  const styles = ["open-peeps", "thumbs"];

  const randomStyle =
    styles[Math.floor(Math.random() * styles.length)];

  const seed = crypto.randomUUID();

  setFormState((prev) => ({
    ...prev,
    profilePic: `https://api.dicebear.com/9.x/${randomStyle}/svg?seed=${seed}`,
  }));
};

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-5">
      <div className="w-full max-w-2xl bg-base-200 rounded-3xl shadow-2xl overflow-hidden">

        <div className="p-8 md:p-12">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary w-12 h-12 rounded-2xl flex items-center justify-center">
              <MessageCircle className="text-primary-content" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">StreamoPhone</h1>
              <p className="text-base-content/70 text-sm">
                Complete Your Profile
              </p>
            </div>
          </div>

          {/* Avatar */}

          <div className="flex flex-col items-center mb-8">

            <img
              src={formState.profilePic}
              alt="profile"
              className="w-28 h-28 rounded-full border-4 border-primary object-cover"
            />

            <button
              type="button"
              className="flex items-center py-2 px-4 rounded-full cursor-pointer border mt-4 gap-2 text-primary active:scale-98 transition-all"
              onClick={generateAvatar}
            >
              <RefreshCw size={16} />
              Generate Random Avatar
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>

              <input
                type="text"
                name="fullName"
                className="input input-bordered w-full bg-base-300"
                value={formState.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Bio</span>
              </label>

              <textarea
                name="bio"
                rows={3}
                className="textarea textarea-bordered w-full bg-base-300"
                value={formState.bio}
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
  <label className="label">
    <span className="label-text">Native Language</span>
  </label>

  <select
    name="nativeLanguage"
    className="select select-bordered w-full bg-base-300"
    value={formState.nativeLanguage}
    onChange={handleChange}
  >
    <option value="" disabled>
      Select your native language
    </option>

    {LANGUAGES.map((language) => (
      <option key={language} value={language}>
        {language}
      </option>
    ))}
  </select>
</div>

              <div>
  <label className="label">
    <span className="label-text bg-base-300">Learning Language</span>
  </label>

  <select
    name="learningLanguage"
    className="select select-bordered w-full bg-base-300"
    value={formState.learningLanguage}
    onChange={handleChange}
  >
    <option value="" disabled>
      Select a language to learn
    </option>

    {LANGUAGES.map((language) => (
      <option key={language} value={language}>
        {language}
      </option>
    ))}
  </select>
</div>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Location</span>
              </label>

              <input
                type="text"
                name="location"
                className="input input-bordered w-full bg-base-300"
                value={formState.location}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={isPending}
            ><Globe size={20} />
              {isPending ? "Saving..." : "Complete Onboarding"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoardPage;