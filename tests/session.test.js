describe('Session Scheduling Routes', () => {
    it('should schedule a session with valid date/time', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .send({ title: 'Test Session', date: '2024-12-01T10:00:00Z' });
  
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', 'Test Session');
    });
  
    it('should prevent scheduling sessions in the past', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .send({ title: 'Past Session', date: '2023-01-01T10:00:00Z' });
  
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Cannot schedule sessions in the past');
    });
  
    it('should handle scheduling conflicts', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .send({ title: 'Conflict Session', date: '2024-12-01T10:00:00Z' });
  
      expect(res.statusCode).toBe(409); // 409 Conflict
      expect(res.body.message).toBe('Session already exists at this time');
    });
  });
  