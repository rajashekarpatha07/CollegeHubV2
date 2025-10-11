import { Router, Request, Response } from "express";
import {
  StudentRegister,
  StudentLogin,
} from "../../controllers/student.controllers/student.controller";
import { verifyUser } from "../../middlewares/auth.middleware";
import { logoutUser } from "../../controllers/auth.controller";

const authRoutes = Router();
authRoutes.route("/register").post(StudentRegister);
authRoutes.route("/login").post(StudentLogin);
authRoutes.route("/me").get(verifyUser, (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    userType: (req as any).userType,
    user: (req as any).user,
  });
});
authRoutes.route("/logout").get(verifyUser, logoutUser);
export default authRoutes;
