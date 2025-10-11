import { Router, Request, Response } from "express";
import {
  facultyregister,
  loginfaculty,
} from "../../controllers/faculty.controllers/faculty.controller";
import { verifyUser } from "../../middlewares/auth.middleware";
import { logoutUser } from "../../controllers/auth.controller";

const facultyroutes = Router();

facultyroutes.route("/register").post(facultyregister);
facultyroutes.route("/login").post(loginfaculty);
facultyroutes.route("/me").get(verifyUser, (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    userType: (req as any).userType,
    user: (req as any).user,
  });
});
facultyroutes.route("/logout").get(verifyUser, logoutUser);
export default facultyroutes;
