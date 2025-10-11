import { Router } from "express";
import { StudentRegister, StudentLogin } from "../controllers/auth.controller";

const authRoutes = Router();
authRoutes.route("/register").post(StudentRegister);
authRoutes.route("/login").post(StudentLogin);
export default authRoutes;