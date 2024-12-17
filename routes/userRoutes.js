import express from 'express';
const router = express.Router();
import {handleCreateuser} from '../controllers/userController.js'
router.post('/profile',handleCreateuser);

export default router;

