import { Router } from "express";
import { registeruser,loginUser } from "../controllers/auth.controller";

const router = Router()

router.route('/register').post(registeruser)
router.route('/login').post(loginUser)

export default router