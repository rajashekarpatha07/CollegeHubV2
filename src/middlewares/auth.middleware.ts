import prisma from "../db/prisma";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id?: number; // faculty
  roll_number?: string; // student
  email: string;
  userType?: "student" | "faculty";
  iat?: number;
  exp?: number;
}

export const verifyUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "No token provided");

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret)
      throw new ApiError(500, "Server misconfigured: missing JWT secret");

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, secret) as DecodedToken;
    } catch (err) {
      throw new ApiError(401, "Invalid or expired token");
    }

    let user = null;

    // check user type based on payload
    if (decoded.roll_number || decoded.userType === "student") {
      user = await prisma.student.findUnique({
        where: { roll_number: decoded.roll_number! },
        select: {
          roll_number: true,
          name: true,
          email: true,
          batch: true,
          semester: true,
          branch_code: true,
        },
      });
      if (!user) throw new ApiError(404, "Student not found");
      (req as any).userType = "student";
    } else {
      user = await prisma.faculty.findUnique({
        where: { id: decoded.id! },
        select: { id: true, name: true, email: true },
      });
      if (!user) throw new ApiError(404, "Faculty not found");
      (req as any).userType = "faculty";
    }

    (req as any).user = user;
    next();
  }
);
