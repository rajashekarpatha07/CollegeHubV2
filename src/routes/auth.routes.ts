import { Router } from "express";
import { registeruser, loginUser } from "../controllers/auth.controller";
import { VerifyToken, requiredrole } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(registeruser);
router.route("/login").post(loginUser);
router.route("/me").get(VerifyToken, (req, res) => {
  res.json({
    user: req.user,
  });
});

//This is route is currently just tested not used in realroutes
// Requires the user to be logged in AND have the 'ADMIN' role.
router.get("/admin-only", VerifyToken, requiredrole("ADMIN"), (req, res) => {
  // This part will only run if the user is an admin
  res.json({ message: `Welcome to the admin panel` });
});

export default router;
