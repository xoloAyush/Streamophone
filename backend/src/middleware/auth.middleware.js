import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    // console.log("decoded:", decoded);
    // console.log("user:", user);

    req.user = user;
    next();

  } catch {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};
