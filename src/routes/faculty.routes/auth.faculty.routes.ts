import { Router, Request, Response } from "express";
import {
  facultyregister,
  loginfaculty,
  getMyAnnouncements,
  getMyMaterials,
  getMyQuestionPapers
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

facultyroutes.route("/announcements/me").get(verifyUser, getMyAnnouncements);
facultyroutes.route("/materials/me").get(verifyUser, getMyMaterials);
facultyroutes.route("/questionpapers/me").get(verifyUser, getMyQuestionPapers);
facultyroutes.route("/logout").get(verifyUser, logoutUser);
export default facultyroutes;
