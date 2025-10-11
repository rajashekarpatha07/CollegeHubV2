import { Router } from "express";
import { StudentRegister, StudentLogin } from "../../controllers/student.controllers/student.controller";

const authRoutes = Router();
authRoutes.route("/register").post(StudentRegister);
authRoutes.route("/login").post(StudentLogin);

export default authRoutes;