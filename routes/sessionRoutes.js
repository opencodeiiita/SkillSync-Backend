import express from 'express';
import { createSession, rescheduleSession, cancelSession } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/schedule', createSession);

router.put('/reschedule/:id', rescheduleSession);

router.delete('/delete/:id', cancelSession);

export default router;
