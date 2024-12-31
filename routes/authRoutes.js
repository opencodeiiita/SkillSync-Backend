import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// Route for user sign-up
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

export default router;
