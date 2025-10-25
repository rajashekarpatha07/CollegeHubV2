import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import prisma from "../../db/prisma";
import { clearAllStudentResourceCaches, clearFacultyCache } from "../../utils/cache.util";


/**
 * @description   used to create a announcement and save indb
 * @route         POST /api/v2/announcement
 * @access        Private (Faculty only)
 */
export const createAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    // Check if the user is a faculty member
    if ((req as any).userType !== "faculty") {
      throw new ApiError(
        403,
        "Forbidden: Only faculty can post announcements."
      );
    }

    const faculty = (req as any).user;
    const { title, content, target_branch_code, target_batch } = req.body;

    // Validate required fields
    if (!title || !content) {
      throw new ApiError(400, "Title and content are required.");
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        target_branch_code,
        target_batch: target_batch ? parseInt(target_batch, 10) : undefined,
        faculty_id: faculty.id, // Link to the logged-in faculty
      },
    });
  
    await clearAllStudentResourceCaches();
    await clearFacultyCache(faculty.id, "announcements"); 

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newAnnouncement,
          "Announcement created successfully."
        )
      );
  }
);

/**
 * @description   used to update the created announcement
 * @route         POST /api/v2/announcement
 * @access        Private (Faculty only)
 */
export const updateAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    // Check if the user is a faculty member
    if ((req as any).userType !== "faculty") {
      throw new ApiError(
        403,
        "Forbidden: Only faculty can update announcements."
      );
    }

    const faculty = (req as any).user;
    const { announcementId } = req.params;
    const { title, content, target_branch_code, target_batch } = req.body;

    if (!announcementId) {
      throw new ApiError(400, "Announcement ID is required.");
    }

    // Find the existing announcement to verify ownership
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id: parseInt(announcementId) },
    });

    if (!existingAnnouncement) {
      throw new ApiError(404, "Announcement not found.");
    }

    // IMPORTANT: Ensure the faculty member updating the post is the one who created it
    if (existingAnnouncement.faculty_id !== faculty.id) {
      throw new ApiError(
        403,
        "Forbidden: You can only update your own announcements."
      );
    }

    const updatedAnnouncement = await prisma.announcement.update({
      where: {
        id: parseInt(announcementId),
      },
      data: {
        title,
        content,
        target_branch_code,
        target_batch: target_batch ? parseInt(target_batch, 10) : undefined,
      },
    });

    await clearAllStudentResourceCaches();
    await clearFacultyCache(faculty.id, "announcements"); 

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedAnnouncement,
          "Announcement updated successfully."
        )
      );
  }
);

/**
 * @description   used to delete the created announcement
 * @route         POST /api/v2/annnoucement
 * @access        Private (Faculty only)
 */
export const deleteAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    // Check if the user is a faculty member
    if ((req as any).userType !== "faculty") {
      throw new ApiError(
        403,
        "Forbidden: Only faculty can delete announcements."
      );
    }

    const faculty = (req as any).user;
    const { announcementId } = req.params;

    if (!announcementId) {
      throw new ApiError(400, "Announcement ID is required.");
    }

    // Find the existing announcement to verify ownership before deleting
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id: parseInt(announcementId) },
    });

    if (!existingAnnouncement) {
      throw new ApiError(404, "Announcement not found.");
    }

    // IMPORTANT: Ensure the faculty member deleting the post is the one who created it
    if (existingAnnouncement.faculty_id !== faculty.id) {
      throw new ApiError(
        403,
        "Forbidden: You can only delete your own announcements."
      );
    }

    await prisma.announcement.delete({
      where: {
        id: parseInt(announcementId),
      },
    });

    await clearAllStudentResourceCaches();
    await clearFacultyCache(faculty.id, "announcements"); 

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Announcement deleted successfully."));
  }
);
