const { MongoClient } = require("mongodb");
const express = require("express");
const request = require("supertest");

// Mock Express App
const app = express();
app.use(express.json());

let db;

// Simple POST API for creating a user
app.post("/users", async (req, res) => {
  const users = db.collection("users");

  try {
    const user = req.body;
    if (!user._id || !user.name || !user.email) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    user.createdAt = new Date();
    user.updatedAt = new Date();

    // Prevent duplicate user creation
    const existingUser = await users.findOne({ _id: user._id });
    if (existingUser) {
      return res.status(409).send({ error: "User already exists" });
    }

    await users.insertOne(user);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Simple GET API for retrieving a user
app.get("/users/:id", async (req, res) => {
  const users = db.collection("users");

  try {
    const user = await users.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Simple PUT API for updating a user
app.put("/users/:id", async (req, res) => {
  const users = db.collection("users");

  try {
    const updatedData = req.body;
    if (!updatedData.name && !updatedData.email && !updatedData.bio) {
      return res.status(400).send({ error: "Nothing to update" });
    }
    updatedData.updatedAt = new Date();

    const result = await users.updateOne(
      { _id: req.params.id },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "User not found" });
    }

    const updatedUser = await users.findOne({ _id: req.params.id });
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

describe("User API Tests", () => {
  let connection;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a new user via POST API", async () => {
    const mockUser = {
      _id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "SecurePassword123",
      skills: ["JavaScript", "Node.js"],
      bio: "A passionate full-stack developer.",
      profilePicture: "https://example.com/john-doe.jpg",
      portfolio: [
        {
          title: "Portfolio Project",
          url: "https://johndoe.dev",
          description: "My personal portfolio website",
        },
      ],
    };

    await db.collection("users").deleteOne({ _id: "user1" }); // Cleanup

    const response = await request(app).post("/users").send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: "user1",
        name: "John Doe",
        email: "john.doe@example.com",
      })
    );

    const insertedUser = await db.collection("users").findOne({ _id: "user1" });
    expect(insertedUser).toBeTruthy();
    expect(insertedUser.name).toBe("John Doe");
  });

  it("should return an error for missing required fields during user creation", async () => {
    const invalidUser = {
      _id: "user2",
      email: "missing.name@example.com",
    };

    const response = await request(app).post("/users").send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Missing required fields" });
  });

  it("should return error if user already exists", async () => {
    const duplicateUser = {
      _id: "user1",
      name: "John Duplicate",
      email: "duplicate@example.com",
    };

    const response = await request(app).post("/users").send(duplicateUser);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: "User already exists" });
  });

  it("should retrieve a user via GET API", async () => {
    const response = await request(app).get("/users/user1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: "user1",
        name: "John Doe",
        email: "john.doe@example.com",
      })
    );
  });

  it("should return an error when trying to retrieve a nonexistent user", async () => {
    const response = await request(app).get("/users/nonexistent");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
  });

  it("should update a user via PUT API", async () => {
    const updatedData = {
      name: "John Updated",
      bio: "An updated bio for John.",
    };

    const response = await request(app).put("/users/user1").send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: "user1",
        name: "John Updated",
        bio: "An updated bio for John.",
      })
    );

    const updatedUser = await db.collection("users").findOne({ _id: "user1" });
    expect(updatedUser.name).toBe("John Updated");
    expect(updatedUser.bio).toBe("An updated bio for John.");
  });

  it("should return error when no data to update via PUT API", async () => {
    const response = await request(app).put("/users/user1").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Nothing to update" });
  });

  it("should return an error if trying to update a nonexistent user", async () => {
    const updatedData = {
      name: "Nonexistent User Update",
    };

    const response = await request(app).put("/users/nonexistent").send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found" });
  });


});
