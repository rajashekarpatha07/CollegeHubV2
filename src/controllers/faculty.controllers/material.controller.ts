import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import cloudinary from "../../config/cloudinary";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/AsyncHandler";
import prisma from "../../db/prisma";

/**
 * @description   Generates a signature for direct frontend uploads to Cloudinary.
 * @route         GET /api/v2/materials/get-signature
 * @access        Private (Faculty only)
 */

export const getCloudinarySignature = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userType = (req as any).userType;

    if (userType !== "faculty") {
      throw new ApiError(
        403,
        "Forbidden: Only faculty can perform this action."
      );
    }
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "collegehub_materials";

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      process.env.CLOUDINARY_API_KEY as string
    );
    res.status(200).json({
      success: true,
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  }
);

/**
 * @description   Saves material metadata to the database after successful Cloudinary upload.
 * @route         POST /api/v2/materials
 * @access        Private (Faculty only)
 */
export const createMaterial = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, file_url, public_id, file_type, subject_code } =
      req.body;

    const faculty = (req as any).user;
    const userType = (req as any).userType;

    if (userType !== "faculty") {
      throw new ApiError(403, "Forbidden: Only faculty can upload materials.");
    }

    // Updated validation
    if (!title || !file_url || !subject_code) {
      throw new ApiError(
        400,
        "Title, file URL, and subject code are required."
      );
    }
    const newMaterial = await prisma.material.create({
      data: {
        title,
        description: description || null, // Handle optional description
        file_url,
        public_id,
        file_type,
        subject_code,
        faculty_id: faculty.id, // Link to the logged-in faculty
      },
    });

    if (!newMaterial) {
      throw new ApiError(500, "Failed to save the material to the database.");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newMaterial,
          "Material uploaded and saved successfully."
        )
      );
  }
);
/**
 * @description   Saves question paper metadata to the database after successful Cloudinary upload.
 * @route         POST /api/v2/materials
 * @access        Private (Faculty only)
 */

export const createQuestionPaper = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Destructure the necessary fields from the request body
    const { title, exam_year, file_url, public_id, file_type, subject_code } =
      req.body;

    // 2. Get user details attached by the authentication middleware
    const faculty = (req as any).user;
    const userType = (req as any).userType;

    // 3. Ensure that only a faculty member can perform this action
    if (userType !== "faculty") {
      throw new ApiError(
        403,
        "Forbidden: Only faculty can upload question papers."
      );
    }

    // 4. Validate that all required fields from the schema are present
    if (
      !title ||
      !exam_year ||
      !file_url ||
      !public_id ||
      !file_type ||
      !subject_code
    ) {
      throw new ApiError(
        400,
        "Title, exam year, file URL, public ID, file type, and subject code are all required."
      );
    }

    // 5. Create a new record in the QuestionPaper table
    const newQuestionPaper = await prisma.questionPaper.create({
      data: {
        title,
        exam_year: parseInt(exam_year, 10), // Ensure exam_year is an integer
        file_url,
        public_id,
        file_type,
        subject_code,
        faculty_id: faculty.id, // Link to the logged-in faculty
      },
    });

    // 6. Handle potential database insertion failure
    if (!newQuestionPaper) {
      throw new ApiError(
        500,
        "Failed to save the question paper to the database."
      );
    }

    // 7. Return a success response with the newly created data
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newQuestionPaper,
          "Question paper uploaded and saved successfully."
        )
      );
  }
);
