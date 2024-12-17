import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import User from "./models/User.js";
import sessionRoutes from "./routes/sessionRoutes.js";

// Load environment variables
dotenv.config();

// Check for MONGO_URI
if (!process.env.MONGO_URI) {
  console.error("Error: MongoDB URI is missing in environment variables.");
  process.exit(1); // Exit the process with an error
}

// Connect to the database
connectDb();

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User registration route
app.post("/register", async (req, res) => {
  const { fullName, email, username, password } = req.body;

  try {
    const user = new User({
      fullName,
      email,
      username,
      password,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully!",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
});

// Session routes
app.use("/session", sessionRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
