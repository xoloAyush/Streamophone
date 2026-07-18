import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { upsertStreamUser } from "../config/stream.js";
import { sendWelcomeEmail, sendLoginEmail } from "../utils/sendEmail.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const colors = [
  "0D8ABC", // Blue
  "6A1B9A", // Purple
  "E53935", // Red
  "00897B", // Teal
  "43A047", // Green
  "FB8C00", // Orange
  "3949AB", // Indigo
  "C2185B", // Pink
  "5E35B1", // Deep Purple
  "546E7A", // Blue Grey
];

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

     if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

const randomAvatar = `https://api.dicebear.com/10.x/thumbs/svg`;

    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
      profilePic: randomAvatar,
    });

await sendWelcomeEmail(newUser.email, newUser.fullName);

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }


    const token = generateToken(newUser._id);

res.cookie("token", token, cookieOptions);

res.status(201).json({
  success: true,
  message: "Signup successful",
  user: {
    id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    profilePic: newUser.profilePic,
  },
});
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    await sendLoginEmail(user.email, user.fullName);

    res.json({
      success: true,
      message: "Login Successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const signout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({
    success: true,
    message: "Logged out",
    // user: req.user
  });
};

export const onboard = async (req, res) => {

  const userId = req.user._id;

  // console.log("User ID from req.user:", userId);

  try{

    const { fullName,bio, nativeLanguage, learningLanguage, location } = req.body;

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
      return res.status(400).json({
        message: "All fields are required",

        missing_Fields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location"
        ].filter(Boolean)
      })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true
      },
      { new: true }
    );

     if (!updatedUser) return res.status(404).json({ message: "User not found" });

     try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } 
    catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

     return res.status(200).json({
  success: true,
  message: "Onboarding completed",
  user: updatedUser,
});
  } 
  
  catch(err){
    res.status(500).json({
      message: err.message,
    });
  }
}


