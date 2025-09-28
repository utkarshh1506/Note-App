import express from "express";
import { sendOtp, verifyOtp } from "../controllers/authController";

const router = express.Router();

router.post("/request-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;
