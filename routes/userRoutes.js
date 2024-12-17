import express from "express";
import { updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(201).send("Hello World!");
});

router.put("/profile/:id", updateUserProfile);

export default router;
