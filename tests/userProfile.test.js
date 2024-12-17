const request = require('supertest');
const app = require('../server'); 
const UserProfile = require('../models/User');

jest.mock('../models/User'); 

describe('UserProfile API Tests', () => {
  // Test for POST /api/users/profile (Create user profile)
  it('should create a user profile successfully', async () => {
    const newUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      skills: ["JavaScript", "Node.js"],
      bio: "Full Stack Developer",
      profilePicture: "https://example.com/john-doe.jpg",
      portfolio: "https://johndoe.dev"
    };

    // Mock the create method to return the new user object
    UserProfile.create.mockResolvedValue(newUser);

    const response = await request(app)
      .post('/api/users/profile')
      .send(newUser)
      .expect(201); // Expect 201 (Created)

    // Check that the response body matches the new user data
    expect(response.body).toEqual(newUser);
  });

  // Test for error if required fields are missing (e.g., name)
  it('should return an error if name is missing', async () => {
    const invalidUser = {
      email: "john.doe@example.com",
      skills: ["JavaScript"],
      bio: "Full Stack Developer",
      profilePicture: "https://example.com/john-doe.jpg",
      portfolio: "https://johndoe.dev"
    };

    const response = await request(app)
      .post('/api/users/profile')
      .send(invalidUser)
      .expect(400);  // Expect 400 (Bad Request)

    expect(response.body.error).toBe('Name is required');
  });

  // Test for error if skills are missing
  it('should return an error if skills are empty', async () => {
    const invalidUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      skills: [],
      bio: "Full Stack Developer",
      profilePicture: "https://example.com/john-doe.jpg",
      portfolio: "https://johndoe.dev"
    };

    const response = await request(app)
      .post('/api/users/profile')
      .send(invalidUser)
      .expect(400);  // Expect 400 (Bad Request)

    expect(response.body.error).toBe('At least one skill is required');
  });

  // Test for PUT /api/users/profile/:id (Update user profile)
  it('should update a user profile successfully', async () => {
    const updatedUser = {
      bio: "Updated bio for John",
      skills: ["React", "MongoDB"]
    };

    // Mock the findByIdAndUpdate method to return the updated user object
    UserProfile.findByIdAndUpdate.mockResolvedValue(updatedUser);

    const response = await request(app)
      .put('/api/users/profile/1')  // Assuming 1 is a valid user ID
      .send(updatedUser)
      .expect(200);  // Expect 200 (OK)

    expect(response.body).toEqual(updatedUser);
  });

  // Test for error if user is not found (e.g., user doesn't exist)
  it('should return an error if user not found', async () => {
    UserProfile.findByIdAndUpdate.mockResolvedValue(null);  // Simulate user not found

    const response = await request(app)
      .put('/api/users/profile/999') 
      .send({ bio: "New bio" })
      .expect(404);  

    expect(response.body.error).toBe('User not found');
  });

  it('should fetch the user portfolio successfully', async () => {
    const portfolioData = { projects: ['Project 1', 'Project 2'] };
    UserProfile.findById.mockResolvedValue({ portfolio: portfolioData });  

    const response = await request(app)
      .get('/api/users/profile/1/portfolio') 
      .expect(200);  

    expect(response.body).toEqual(portfolioData);
  });
  it('should return an error if user not found', async () => {
    UserProfile.findById.mockResolvedValue(null); 

    const response = await request(app)
      .get('/api/users/profile/999/portfolio') 
      .expect(404); 

    expect(response.body.error).toBe('User not found');
  });
});