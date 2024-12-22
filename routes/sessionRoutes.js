import express from 'express';
import { createSession, rescheduleSession, cancelSession, getSessionAvailability } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/schedule', createSession);

router.put('/reschedule/:id', rescheduleSession);

router.delete('/delete/:id', cancelSession);

router.get('/availability', getSessionAvailability);

export default router;
