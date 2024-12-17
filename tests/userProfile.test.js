import request from 'supertest';
import app from '../app'; // Assuming you have an Express app instance
import User from '../models/User'; // Adjust the path as necessary

describe('User Profile Routes', () => {
    let token; // Auth token to authenticate requests
  
    beforeAll(async () => {
      // Obtain a valid token for authentication
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'Password123!' });
      token = loginRes.body.token;
    });
  
    it('should create a user profile', async () => {
      const res = await request(app)
        .post('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'John Doe', age: 25 });
  
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('John Doe');
    });
  
    it('should fetch user profile', async () => {
      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'John Doe');
    });
  
    it('should update user profile', async () => {
      const res = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ age: 26 });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.age).toBe(26);
    });
  
    it('should delete user profile', async () => {
      const res = await request(app)
        .delete('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Profile deleted successfully');
    });
  });
  


describe('PUT /api/users/profile/:id', () => {
  let user;

  beforeAll(async () => {
    user = new User({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "Jane123",
      skills: ["Python", "Django"],
      bio: "Backend Developer",
      profilePicture: "https://example.com/jane-doe.jpg",
      portfolio: "https://janedoe.dev",
    });
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it('should update user profile successfully', async () => {
    const res = await request(app)
      .put(`/api/users/profile/${user._id}`)
      .send({ skills: ["Python", "Flask"], bio: "Updated bio" });

    expect(res.status).toBe(200);
    expect(res.body.skills).toEqual(["Python", "Flask"]);
    expect(res.body.bio).toBe("Updated bio");
  });

  it('should return 400 for invalid skills', async () => {
    const res = await request(app)
      .put(`/api/users/profile/${user._id}`)
      .send({ skills: "Invalid skills" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Skills must be an array of strings");
  });

  it('should return 400 for bio exceeding character limit', async () => {
    const res = await request(app)
      .put(`/api/users/profile/${user._id}`)
      .send({ bio: "a".repeat(501) });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Bio cannot exceed 500 characters");
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(app)
      .put('/api/users/profile/invalidUserId')
      .send({ skills: ["Python", "Flask"] });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });
});