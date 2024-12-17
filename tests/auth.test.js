const request = require('supertest');
const app = require('../app'); // Import your Express app

describe('Authentication Routes', () => {
  // Test for Signup
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: 'Password123!' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  // Test for Login
  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Password123!' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  // Error Handling for Invalid Login
  it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'WrongPassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });
});
