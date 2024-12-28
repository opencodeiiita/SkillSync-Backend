import express from 'express';
import { createSession, rescheduleSession, cancelSession, getSessionAvailability } from '../controllers/sessionController.js';
import { addReview, getReviews } from '../controllers/sessionReviewController.js';

const router = express.Router();

router.post('/schedule', createSession);

router.put('/reschedule/:id', rescheduleSession);

router.delete('/delete/:id', cancelSession);

router.get('/availability', getSessionAvailability);

router.post('/review/:id', addReview);

router.get('/review/:id', getReviews);

export default router;
