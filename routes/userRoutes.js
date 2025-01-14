import express from "express";
import { handleUpdateUser,getAllNotesBySession,getAllSessionsByUser,addPortfolio,viewPortfolio, updatePortfolio } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
console.log(authMiddleware);

const router = express.Router();

router.put("/profile/:id", handleUpdateUser);

// route to add portfolio to a user's profile
router.post("/profile/:id/portfolio", authMiddleware, addPortfolio);

// route to view a user's portfolio
router.get("/profile/:id/portfolio", viewPortfolio);

// route to update a portfolio item
router.put( "/profile/:id/portfolio/:portfolioId", authMiddleware, updatePortfolio);

router.get('/sessions/:userId', getAllSessionsByUser);
router.get('/sessions/:userId/:sessionId/notes', getAllNotesBySession);

export default router;
