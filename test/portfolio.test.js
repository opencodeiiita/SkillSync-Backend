import request from 'supertest';

import { expect } from 'chai';
import mongoose from 'mongoose';
import UserProfile from '../models/User.js'; 
import { authenticateUser } from '../middleware/authMiddleware.js';  
import app from "../server.js";


let userId;
let portfolioId;

describe('Portfolio API Tests', () => {
  
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/user-role-permission', { useNewUrlParser: true, useUnifiedTopology: true });


    const user = new UserProfile({
      name: 'gagan',
      email: 'jgn@example.com',
      skills: ['JavaScript'],
      bio: 'Full-stack Developer',
      portfolio: []
    });
    await user.save();
    userId = user._id;
  });

  after(async () => {
    
    await UserProfile.deleteMany({});
    mongoose.connection.close();
  });

  describe('POST /api/users/profile/:id/portfolio', () => {
    it('should add a portfolio item', async () => {
      const portfolioData = {
        title: 'My Portfolio',
        url: 'https://portfolio.example.com',
        description: 'A great project portfolio'
      };

      const res = await request(app)
        .post(`/api/users/profile/${userId}/portfolio`)
        .send(portfolioData)
        .set('Authorization', `Bearer <valid-token>`);  

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('Portfolio item added successfully');
      expect(res.body.portfolio).to.be.an('array');
      expect(res.body.portfolio[0]).to.include(portfolioData);

      portfolioId = res.body.portfolio[0]._id;  // Save the portfolioId for later tests
    });

    it('should return 403 if the user is unauthorized', async () => {
      const portfolioData = {
        title: 'My Unauthorized Portfolio',
        url: 'https://portfolio.example.com',
        description: 'A portfolio not owned by the user'
      };

      const res = await request(app)
        .post(`/api/users/profile/${userId}/portfolio`)
        .send(portfolioData)
        .set('Authorization', 'Bearer <invalid-token>');  // Invalid token

      expect(res.status).to.equal(403);
      expect(res.body.message).to.equal('Unauthorized access');
    });
  });

  describe('GET /api/users/profile/:id/portfolio', () => {
    it('should get all portfolio items for the user', async () => {
      const res = await request(app)
        .get(`/api/users/profile/${userId}/portfolio`)
        .set('Authorization', `Bearer <valid-token>`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('title');
    });

    it('should return 404 if the user is not found', async () => {
      const res = await request(app)
        .get('/api/users/profile/invalidUserId/portfolio')
        .set('Authorization', `Bearer <valid-token>`);

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('User not found');
    });
  });

  describe('PUT /api/users/profile/:id/portfolio/:portfolioId', () => {
    it('should update a portfolio item', async () => {
      const updatedData = {
        title: 'Updated Portfolio',
        url: 'https://updated-portfolio.com',
        description: 'Updated description'
      };

      const res = await request(app)
        .put(`/api/users/profile/${userId}/portfolio/${portfolioId}`)
        .send(updatedData)
        .set('Authorization', `Bearer <valid-token>`);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Portfolio item updated');
      expect(res.body.portfolio[0]).to.include(updatedData);
    });

    it('should return 404 if portfolio item is not found', async () => {
      const updatedData = {
        title: 'Non-existent Portfolio',
        url: 'https://non-existent-portfolio.com',
        description: 'This portfolio doesn’t exist'
      };

      const res = await request(app)
        .put(`/api/users/profile/${userId}/portfolio/invalidPortfolioId`)
        .send(updatedData)
        .set('Authorization', `Bearer <valid-token>`);

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Portfolio item not found');
    });

    it('should return 403 if the user tries to update another user’s portfolio', async () => {
      const updatedData = {
        title: 'Unauthorized Portfolio',
        url: 'https://unauthorized-portfolio.com',
        description: 'This is not your portfolio'
      };

      const res = await request(app)
        .put(`/api/users/profile/${userId}/portfolio/${portfolioId}`)
        .send(updatedData)
        .set('Authorization', `Bearer <invalid-token>`);

      expect(res.status).to.equal(403);
      expect(res.body.message).to.equal('Unauthorized access');
    });
  });
});
