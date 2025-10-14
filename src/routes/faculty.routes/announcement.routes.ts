import { Router } from "express";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from "../../controllers/faculty.controllers/announcement.controller";
import { verifyUser } from "../../middlewares/auth.middleware";

const router = Router();

// Apply the middleware to all announcement routes that require authentication
router.use(verifyUser);

// Routes
router.route("/").post(createAnnouncement);

router
  .route("/:announcementId")
  .patch(updateAnnouncement) // Using PATCH for partial updates is common
  .delete(deleteAnnouncement);

export default router;