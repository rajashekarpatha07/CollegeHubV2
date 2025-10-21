import { Request, Response } from "express";
import prisma from "../../db/prisma";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import {
  generateAccessToken,
  hashpassword,
  verifypassword,
} from "../../utils/auth.util/auth.util";

const facultyregister = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new ApiError(400, "All felds are required");

  const normalizedEmail = String(email).trim().toLowerCase();

  const existingfaculty = await prisma.faculty.findFirst({
    where: { email: normalizedEmail },
  });

  if (existingfaculty)
    throw new ApiError(400, "Faculty already exist trry to login");

  const hashedpassword = await hashpassword(password);

  const createdfaculty = await prisma.faculty.create({
    data: {
      name: String(name).trim(),
      password: hashedpassword,
      email: normalizedEmail,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdfaculty,
        "New faculty registered successfully"
      )
    );
});

const loginfaculty = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, "ALl feilds are require");

  const normalizedEmail = String(email).trim().toLowerCase();

  const faculty = await prisma.faculty.findFirst({
    where: { email: normalizedEmail },
  });

  if (!faculty) throw new ApiError(400, "Faculty not existes register first");

  const checkpassword = await verifypassword(password, faculty.password);

  if (!checkpassword) throw new ApiError(400, "Email or Password are invalid");

  const token = generateAccessToken({
    id: faculty.id,
    email: faculty.email,
  });

  const { password: _, ...facultyWithoutPassword } = faculty;

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        student: facultyWithoutPassword,
        token,
      },
      "Faculty logged in successfully!"
    )
  );
});

const getMyAnnouncements = asyncHandler(async (req: Request, res: Response) => {
  const faculty = (req as any).user;
  const userType = (req as any).userType;

  if (userType !== "faculty") {
    throw new ApiError(403, "Forbidden: This route is for faculty only.");
  }

  const announcements = await prisma.announcement.findMany({
    where: {
      faculty_id: faculty.id,
    },
    orderBy: {
      post_date: "desc",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, announcements, "Announcements fetched successfully.")
    );
});

const getMyMaterials = asyncHandler(async (req: Request, res: Response) => {
  const faculty = (req as any).user;
  const userType = (req as any).userType;

  if (userType !== "faculty") {
    throw new ApiError(403, "Forbidden: This route is for faculty only.");
  }

  const materials = await prisma.material.findMany({
    where: {
      faculty_id: faculty.id,
    },
    orderBy: {
      upload_date: "desc",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, materials, "Materials fetched successfully."));
});

const getMyQuestionPapers = asyncHandler(async (req: Request, res: Response) => {
  const faculty = (req as any).user;
  const userType = (req as any).userType;

  if (userType !== 'faculty') {
    throw new ApiError(403, "Forbidden: This route is for faculty only.");
  }

  const papers = await prisma.questionPaper.findMany({
    where: {
      faculty_id: faculty.id,
    },
    orderBy: {
      upload_date: 'desc',
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, papers, "Question papers fetched successfully."));
});
export { facultyregister, loginfaculty, getMyAnnouncements, getMyMaterials, getMyQuestionPapers };
