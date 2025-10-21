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
    throw new ApiError(401, "Roll number and password are required");
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

const getStudentResources = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Get the authenticated student from the request object
    const student = (req as any).user;
    const userType = (req as any).userType;

    // 2. Validate that the user is indeed a student
    if (userType !== "student" || !student) {
      throw new ApiError(403, "Forbidden: This route is for students only.");
    }

    const { branch_code, batch, semester } = student;

    if (!branch_code || !batch || !semester) {
      throw new ApiError(
        400,
        "Student profile is incomplete. Branch, batch, and semester are required."
      );
    }

    // 3. Fetch all three resource types in parallel
    const [announcements, materials, questionPapers] = await Promise.all([
      // Fetch Announcements (This query is correct, no changes needed)
      prisma.announcement.findMany({
        where: {
          OR: [
            { target_branch_code: null, target_batch: null },
            { target_branch_code: branch_code, target_batch: null },
            { target_branch_code: null, target_batch: batch },
            { target_branch_code: branch_code, target_batch: batch },
          ],
        },
        orderBy: { post_date: "desc" },
        include: { faculty: { select: { name: true } } },
      }),

      // Fetch Materials for the student's current semester and branch
      
      prisma.material.findMany({
        where: {
          semester: semester, // <-- Filter by semester on the Material model
          subject: {
            branches: { some: { branch_code: branch_code } }, // <-- Still filter by branch on the related Subject
          },
        },
        orderBy: { upload_date: "desc" },
        include: {
          subject: { select: { subject_name: true, subject_code: true } },
          faculty: { select: { name: true } },
        },
      }),

      // Fetch Question Papers (This query is correct, no changes needed)
      prisma.questionPaper.findMany({
        where: {
          subject: {
            branches: { some: { branch_code: branch_code } },
          },
        },
        orderBy: { exam_year: "desc" },
        include: {
          subject: { select: { subject_name: true, subject_code: true } },
          faculty: { select: { name: true } },
        },
      }),
    ]);

    // 4. Build a frontend-friendly response payload
    const resources = {
      announcements: {
        items: announcements,
        count: announcements.length,
        message:
          announcements.length > 0
            ? `${announcements.length} announcement(s) found.`
            : "No new announcements found.",
      },
      materials: {
        items: materials,
        count: materials.length,
        message:
          materials.length > 0
            ? `${materials.length} material(s) found for your semester.`
            : "No study materials have been uploaded for your current semester yet.",
      },
      questionPapers: {
        items: questionPapers,
        count: questionPapers.length,
        message:
          questionPapers.length > 0
            ? `${questionPapers.length} question paper(s) found.`
            : "No previous year question papers are available for your branch yet.",
      },
    };

    // 5. Send the structured response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          resources,
          "Student resources fetched successfully."
        )
      );
  }
);

export { StudentRegister, StudentLogin, getStudentResources };
