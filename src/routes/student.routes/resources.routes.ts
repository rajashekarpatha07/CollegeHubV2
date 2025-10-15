import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware";
import { getStudentResources } from "../../controllers/student.controllers/student.controller";

const resourcesrouter = Router();

// This middleware will be applied to all routes in this file
// It ensures that a user is logged in and attaches their details to the request object
resourcesrouter.use(verifyUser);

// Define the route for getting resources
resourcesrouter.route("/").get(getStudentResources);

export default resourcesrouter;