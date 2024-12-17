import User from '../models/User.js' 
import bcrypt from "bcrypt";

export async function handleCreateUser(req, res) {
  try {
    const { name, email, password, skills, bio, profilePicture, portfolio } = req.body;

    if (!name || name.length < 2) {
      return res.status(400).json({ error: "Name is required and must be at least 2 characters long." });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Valid email is required." });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ error: "At least one skill is required." });
    }

    // Optional validations for bio and URLs
    if (bio && bio.length > 500) {
      return res.status(400).json({ error: "Bio cannot exceed 500 characters." });
    }

    if (portfolio && !/^https?:\/\/.+$/.test(portfolio)) {
      return res.status(400).json({ error: "Invalid portfolio URL." });
    }

    let finalProfilePicture = profilePicture;
    if (!profilePicture) {
      finalProfilePicture = "https://avatar.iran.liara.run/public/boy?username=Ash";
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      skills,
      bio,
      profilePicture: finalProfilePicture,
      portfolio,
    });

    await newUser.save();

    const responseUser = { ...newUser._doc };
    delete responseUser.password;

    return res.status(201).json({
      message: "User created successfully.",
      user: responseUser,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res.status(500).json({ error: "Error creating user: " + error.message });
  }
}


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
