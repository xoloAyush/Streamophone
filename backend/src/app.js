import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "../src/routes/auth.routes.js";
import userRoutes from "../src/routes/user.routes.js";
import chatRoutes from "../src/routes/chat.routes.js";
import cors from 'cors'
import path from "path";

dotenv.config();

const app = express();

const __dirname = path.resolve();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API Running");
  });
}

export default app;
