import express from "express";
import { handleCreateUser ,handleUpdateUser,getAllNotesBySession,getAllSessionsByUser} from "../controllers/userController.js";
import UserProfile from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
console.log(authMiddleware);

const router = express.Router();

router.post("/profile", handleCreateUser);
router.post("/register", handleCreateUser);
router.put("/profile/:id", handleUpdateUser);
// route to register a new user profile (if you need one here, otherwise skip it)
router.post("/register", async (req, res) => {
  const { fullName, email, username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserProfile.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const userProfile = new UserProfile({
      fullName,
      email,
      username,
      password,
    });
    await userProfile.save();

    res.status(201).json({ message: "User profile created successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user profile", error: err.message });
  }
});

// route to add portfolio to a user's profile
router.post("/profile/:id/portfolio", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, url, description } = req.body;

  if (req.user.id !== id) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  try {
    const userProfile = await UserProfile.findOne({ userId: id });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    userProfile.portfolio.push({ title, url, description });
    await userProfile.save();

    res
      .status(201)
      .json({
        message: "Portfolio item added successfully",
        portfolio: userProfile.portfolio,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// route to view a user's portfolio
router.get("/profile/:id/portfolio", async (req, res) => {
  const { id } = req.params;

  try {
    const userProfile = await UserProfile.findOne({ userId: id });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json(userProfile.portfolio);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// route to update a portfolio item
router.put(
  "/profile/:id/portfolio/:portfolioId",
  authMiddleware,
  async (req, res) => {
    const { id, portfolioId } = req.params;
    const { title, url, description } = req.body;

    if (req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    try {
      const userProfile = await UserProfile.findOne({ userId: id });
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      const portfolioIndex = userProfile.portfolio.findIndex(
        (item) => item._id.toString() === portfolioId
      );
      if (portfolioIndex === -1) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }

      // update portfolio item
      userProfile.portfolio[portfolioIndex] = { title, url, description };
      await userProfile.save();

      res
        .status(200)
        .json({
          message: "Portfolio item updated",
          portfolio: userProfile.portfolio,
        });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.get('/sessions/:userId', getAllSessionsByUser);
router.get('/sessions/:userId/:sessionId/notes', getAllNotesBySession);

export default router;
