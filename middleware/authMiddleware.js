import jwt from 'jsonwebtoken'
import User from '../models/User.js';
import { unauthorizedResponse, serverErrorResponse } from '../utils/responseCode.utils.js';

//authMiddleware extracts JWT from req.cookies.token, validates it, and attaches req.userId and req.user

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return unauthorizedResponse(res, 'No token provided. Authentication failed.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return unauthorizedResponse(res, 'Invalid or expired token.');
    }

    const user = await User.findById(decoded.id).select('-password'); // Exclude password
    if (!user) {
      return unauthorizedResponse(res, 'User does not exist.');
    }

    req.userId = user._id;
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return serverErrorResponse(res, 'Internal server error during authentication.');
  }
};

export default authMiddleware;
