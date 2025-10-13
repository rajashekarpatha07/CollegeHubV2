import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware";
import {
  getCloudinarySignature,
  createMaterial,
} from "../../controllers/faculty.controllers/material.controller";

const router = Router();
router.use(verifyUser);
// Route to get the signature for uploading
router.route("/get-signature").get(getCloudinarySignature);

// Route to create the material entry in the database
router.route("/").post(createMaterial);

export default router;
