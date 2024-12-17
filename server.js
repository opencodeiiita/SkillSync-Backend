import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import User from "./models/User.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
connectDb();

app.use('/api/users', userRouter);

app.post("/register", async (req, res) => {
  const { fullName, email, username, password } = req.body;

  try {
    const user = new User({
      name:fullName,
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

app.use("/session", sessionRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
