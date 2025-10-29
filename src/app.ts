import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError";
import { ApiResponse } from "./utils/ApiResponse";
// --- Route Imports ---
import authroutes from "./routes/student.routes/auth.student.routes";
import resourcesrouter from "./routes/student.routes/resources.routes";
import facultyroutes from "./routes/faculty.routes/auth.faculty.routes";
import materialRouter from "./routes/faculty.routes/material.routes";
import AnnouncementRouter from "./routes/faculty.routes/announcement.routes";

// Create the express app
const app = express();

// --- Core Middleware ---
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// --- Route Mounting ---
app.use("/api/v2/auth/student", authroutes);
app.use("/api/v2/student/resources", resourcesrouter);
app.use("/api/v2/auth/faculty", facultyroutes);
app.use("/api/v2/materials", materialRouter);
app.use("/api/v2/announcement", AnnouncementRouter);

// --- Global Error Handler ---
// This must be after all your routes
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error caught:", err);

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, err.data, err.message));
  }

  // Handle unexpected errors
  return res
    .status(500)
    .json(new ApiResponse(500, null, "Internal Server Error"));

  next();
});

// Export the configured app
export { app };
