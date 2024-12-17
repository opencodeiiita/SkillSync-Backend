import User from "../models/User.js";

export const signup = async (req, res) => {

  try {

    const { name, email, username, password, skills, bio, profilePicture, portfolio } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "Name, email, username, and password are required." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log(existingUser);
      return res.status(409).json({ message: "User with this email or username already exists." });
    }


    const user = new User({
      name,
      email,
      username,
      password, // Will be hashed by User schema pre-save middleware
      skills: skills || [],
      bio: bio || "",
      profilePicture: profilePicture || "",
      portfolio: portfolio || "",
    });

    try {
      await user.save();
    } 
    catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }
    
    const token = user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });

  } 
  catch (error) {

    console.error("Signup Controller Error:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });

  }
};
