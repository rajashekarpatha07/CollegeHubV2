import { Router } from "express";
import {
  facultyregister,
  loginfaculty,
} from "../../controllers/faculty.controllers/faculty.controller";

const facultyroutes = Router();

facultyroutes.route("/register").post(facultyregister);
facultyroutes.route("/login").post(loginfaculty);

export default facultyroutes;
