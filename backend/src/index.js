//dotenv: Loads secret keys (like DB URLs) from .env file to keep code clean and secure.z
//cors: Allows frontend from another domain to safely talk to your backend.
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
//connectDB: Connects your app to the database.
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
// app, server: Set up your Express app and Socket.io server for real-time features.
import { app, server } from "./lib/socket.js";

// dotenv.config(): Loads environment variables from the .env file
dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// repo root = backend/src -> ../..
const FRONTEND_DIST = path.join(__dirname, "../../frontend/CHAT-APP/dist");
// Large limit so base64 profile/message images are not rejected (default is 100kb)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(FRONTEND_DIST));

  app.get("*", (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });
}
//if server is running , print console.log
server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});