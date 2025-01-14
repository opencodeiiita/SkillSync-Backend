import User from '../models/User.js' 

export const handleUpdateUser = async (req, res) => {
  const { id } = req.params;
  const { skills, bio, profilePicture } = req.body;

  try {
    if (skills && (!Array.isArray(skills) || !skills.every(skill => typeof skill === 'string'))) {
      return res.status(400).json({ message: "Skills must be an array of strings" });
    }
    if (bio && bio.length > 500) {
      return res.status(400).json({ message: "Bio cannot exceed 500 characters" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { skills, bio, profilePicture },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllSessionsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Assuming you have a Session model to interact with the database
    const sessions = await Session.find({ userId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllNotesBySession = async (req, res) => {
  const { userId, sessionId } = req.params;
  try {
    // Assuming you have a Note model to interact with the database
    const notes = await Note.find({ userId, sessionId });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addPortfolio = async (req, res) => {

  const { id } = req.params;
  const { title, url, description } = req.body;

  if (req.user.id !== id) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  try {
    const userProfile = await User.findOne({ userId: id });
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
};

export const viewPortfolio = async (req, res) => {

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
};

export const updatePortfolio = async (req, res) => {
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
};