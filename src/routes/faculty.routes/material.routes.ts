import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware";
import {
  getCloudinarySignature,
  createMaterial,
  createQuestionPaper,
  updateMaterial,
  deleteMaterial
} from "../../controllers/faculty.controllers/material.controller";

const router = Router();
router.use(verifyUser);
// Route to get the signature for uploading
router.route("/get-signature").get(getCloudinarySignature);

// Route to create the material entry in the database
router.route("/create-material").post(createMaterial);
router.route("/create-pyq").post(createQuestionPaper);

// ... other routes
router.route("/:materialId")
    .patch(verifyUser, updateMaterial)
    .delete(verifyUser, deleteMaterial);
export default router;
