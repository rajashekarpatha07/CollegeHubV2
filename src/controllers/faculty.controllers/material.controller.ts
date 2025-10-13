import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import cloudinary from "../../config/cloudinary";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/AsyncHandler";
import prisma from "../../db/prisma";

/**
 * @description   Generates a signature for direct frontend uploads to Cloudinary.
 * @route         GET /api/v1/materials/get-signature
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
 * @route         POST /api/v1/materials
 * @access        Private (Faculty only)
 */
export const createMaterial = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, file_url, subject_code } = req.body;

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
        description: description || null,
        file_url, // Only the URL is saved
        subject_code,
        faculty_id: faculty.id,
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
