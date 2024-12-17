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
  