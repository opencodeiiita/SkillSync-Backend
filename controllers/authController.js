import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, skills, bio, profilePicture, portfolio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
      console.log(existingUser);
      return res.status(409).json({ message: "User with this email already exists." });
    }

    const user = new User({
      name,
      email,
      password, // Will be hashed by User schema pre-save middleware
      skills: skills || [],
      bio: bio || "",
      profilePicture: profilePicture || "",
      portfolio: portfolio || [],
    });

    try {
      await user.save();
    } catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    const token = user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup Controller Error:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

export const signin = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error:"Email and password are required.", message: "Email and password are required.", result: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error:"User not found.", message: "User not found. register first", result: false });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error:"Invalid password.", message: "Invalid password.", result: false });
    }

    const token = user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7* 24* 3600000, // 7 days
    });

    res.status(200).json({
      message: "User logged in successfully.",
      error: false,
      result: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });

  } 
  catch (error) {

    console.error("Sign Controller Error:", error);
    res.status(500).json({ error:"error in authController login function", message: "Internal server error. Please try again later.", result: false });
  }

};