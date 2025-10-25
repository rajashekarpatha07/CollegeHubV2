import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import cloudinary from "../../config/cloudinary";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/AsyncHandler";
import prisma from "../../db/prisma";
import { clearAllStudentResourceCaches, clearFacultyCache } from "../../utils/cache.util";

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

    // FIX: Use CLOUDINARY_API_SECRET instead of CLOUDINARY_API_KEY
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      process.env.CLOUDINARY_API_SECRET as string // Changed from CLOUDINARY_API_KEY
    );

    res.status(200).json({
      success: true,
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY, // This stays as API_KEY
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
    const {
      title,
      description,
      file_url,
      public_id,
      file_type,
      subject_code,
      semester,
    } = req.body;

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
        semester: semester,
        faculty_id: faculty.id, // Link to the logged-in faculty
      },
    });

    if (!newMaterial) {
      throw new ApiError(500, "Failed to save the material to the database.");
    }

    await clearAllStudentResourceCaches();
    await clearFacultyCache(faculty.id, "announcements"); 

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

    await clearAllStudentResourceCaches();
    await clearFacultyCache(faculty.id, "announcements"); 

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

/**
 * @description   Update a material's details
 * @route         PATCH /api/v2/materials/:materialId
 * @access        Private (Faculty only)
 */
export const updateMaterial = asyncHandler(
  async (req: Request, res: Response) => {
    const { materialId } = req.params;
    const { title, description, subject_code, semester } = req.body;
    const faculty = (req as any).user;

    const material = await prisma.material.findUnique({
      where: { id: parseInt(materialId) },
    });
    if (!material) throw new ApiError(404, "Material not found.");

    // Security check: ensure the faculty owns this material
    if (material.faculty_id !== faculty.id) {
      throw new ApiError(
        403,
        "Forbidden: You can only update your own materials."
      );
    }

    const updatedMaterial = await prisma.material.update({
      where: { id: parseInt(materialId) },
      data: {
        title,
        description,
        subject_code,
        semester: parseInt(semester, 10),
      },
    });

    await clearAllStudentResourceCaches();
    await clearFacultyCache(faculty.id, "announcements"); 


    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedMaterial, "Material updated successfully.")
      );
  }
);

/**
 * @description   Delete a material
 * @route         DELETE /api/v2/materials/:materialId
 * @access        Private (Faculty only)
 */
export const deleteMaterial = asyncHandler(
  async (req: Request, res: Response) => {
    const { materialId } = req.params;
    const faculty = (req as any).user;

    const material = await prisma.material.findUnique({
      where: { id: parseInt(materialId) },
    });
    if (!material) throw new ApiError(404, "Material not found.");

    // Security check
    if (material.faculty_id !== faculty.id) {
      throw new ApiError(
        403,
        "Forbidden: You can only delete your own materials."
      );
    }

    // Step 1: Delete the file from Cloudinary
    await cloudinary.uploader.destroy(material.public_id);

    // Step 2: Delete the record from the database
    await prisma.material.delete({ where: { id: parseInt(materialId) } });

    await clearAllStudentResourceCaches();
    await clearFacultyCache(faculty.id, "announcements"); 


    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Material deleted successfully."));
  }
);

export const updatequestionPaper = asyncHandler(
  async (req: Request, res: Response) => {
    const { QuestionPaperId } = req.params;
    const { title, description, subject_code, semester } = req.body;
    const faculty = (req as any).user;

    const questionpaper = await prisma.questionPaper.findUnique({
      where: { id: parseInt(QuestionPaperId) },
    });
    if (!questionpaper) throw new ApiError(404, "Material not found.");

    // Security check: ensure the faculty owns this material
    if (questionpaper.faculty_id !== faculty.id) {
      throw new ApiError(
        403,
        "Forbidden: You can only update your own materials."
      );
    }

    const updatedQuestionpaper = await prisma.material.update({
      where: { id: parseInt(QuestionPaperId) },
      data: {
        title,
        description,
        subject_code,
        semester: parseInt(semester, 10),
      },
    });

    await clearAllStudentResourceCaches();
    await clearFacultyCache(faculty.id, "announcements"); 



    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedQuestionpaper,
          "Material updated successfully."
        )
      );
  }
);

export const deleteQuestionPaper = asyncHandler(
  async (req: Request, res: Response) => {
    const { QuestionPaperId } = req.params;
    const faculty = (req as any).user;

    const questionpaper = await prisma.questionPaper.findUnique({
      where: { id: parseInt(QuestionPaperId) },
    });
    if (!questionpaper) throw new ApiError(404, "Material not found.");

    // Security check
    if (questionpaper.faculty_id !== faculty.id) {
      throw new ApiError(
        403,
        "Forbidden: You can only delete your own materials."
      );
    }

    // Step 1: Delete the file from Cloudinary
    await cloudinary.uploader.destroy(questionpaper.public_id);

    // Step 2: Delete the record from the database
    await prisma.material.delete({ where: { id: parseInt(QuestionPaperId) } });

    await clearAllStudentResourceCaches()
    await clearFacultyCache(faculty.id, "announcements"); 

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Material deleted successfully."));
  }
);
