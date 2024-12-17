import express from 'express';
const router = express.Router();
import {handleCreateUser, handleUpdateUser} from '../controllers/userController.js';


router.post('/register',handleCreateUser);
router.put('/profile/:id',handleUpdateUser);

export default router;

