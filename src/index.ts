import express from "express";
import dotenv from "dotenv";
import prisma from './db/prisma'
import cookieParser from 'cookie-parser'
import cors from "cors";
import authroutes from "./routes/auth.routes";
import { ApiResponse } from "./utils/ApiResponse";
import { ApiError } from "./utils/ApiError";
import { Request, Response, NextFunction } from "express";

dotenv.config();
const app = express();
const PORT = process.env.SERVERPORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api/v2/auth/", authroutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error caught:", err);

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, err.data, err.message));
  }

  return res
    .status(500)
    .json(new ApiResponse(500, null, "Internal Server Error"));
});

const startserver = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error in connecting to Database!");
    console.log(error);
    process.exit(1);
  }
};

startserver();
