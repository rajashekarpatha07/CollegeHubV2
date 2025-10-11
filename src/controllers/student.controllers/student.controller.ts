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

/**
 * @route POST /api/v1/students/register
 * @description Register a new student
 * @access Public
 */

const StudentRegister = asyncHandler(async (req: Request, res: Response) => {
  const { roll_number, name, email, password, batch, semester, branch_code } =
    req.body;

  if (!roll_number || !name || !email || !password || !batch || !semester)
    throw new ApiError(400, "All fields are required");

  const IsBranchExist = await prisma.branch.findUnique({
    where: { branch_code: branch_code },
  });

  if (!IsBranchExist) {
    throw new ApiError(400, "The selected branch does not exist.");
  }

  const existingStudent = await prisma.student.findFirst({
    where: {
      OR: [{ roll_number }, { email }],
    },
  });

  if (existingStudent) {
    const field =
      existingStudent.roll_number === roll_number ? "Roll number" : "Email";
    throw new ApiError(409, `${field} is already registered.`); // 409 Conflict
  }

  const hashedPassword = await hashpassword(password);

  // 6. Create the new student record in the database
  const createdStudent = await prisma.student.create({
    data: {
      roll_number,
      name,
      email,
      password: hashedPassword,
      batch: Number(batch),
      semester: Number(semester),
      branch_code,
    },
    // Select the fields to return, excluding the password
    select: {
      roll_number: true,
      name: true,
      email: true,
      batch: true,
      semester: true,
      branch_code: true,
    },
  });

  // 7. Send a successful response using your ApiResponse class
  return res
    .status(201)
    .json(
      new ApiResponse(201, createdStudent, "Student registered successfully!")
    );
});

/**
 * @route POST /api/v1/students/login
 * @description Login a student
 * @access Public
 */
const StudentLogin = asyncHandler(async (req: Request, res: Response) => {
  const { roll_number, password } = req.body;

  if (!roll_number || !password) {
    throw new ApiError(400, "Roll number and password are required");
  }

  // Find student by roll_number
  const student = await prisma.student.findUnique({
    where: { roll_number },
    select: {
      roll_number: true,
      name: true,
      email: true,
      password: true,
      batch: true,
      semester: true,
      branch_code: true,
    },
  });

  if (!student) {
    throw new ApiError(401, "Invalid roll number or password");
  }

  // Verify password
  const isPasswordValid = await verifypassword(password, student.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid roll number or password");
  }

  // Generate JWT token
  const token = generateAccessToken({
    roll_number: student.roll_number,
    email: student.email,
    userType: "student",
  });

  // Remove password from response
  const { password: _, ...studentWithoutPassword } = student;

  // Set cookie and send response
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
        student: studentWithoutPassword,
        token,
      },
      "Student logged in successfully!"
    )
  );
});



export { StudentRegister, StudentLogin};
