import express from 'express';
import { createSession, rescheduleSession, cancelSession, getSessionAvailability, enrollUserIntoSession, removeUserFromSession } from '../controllers/sessionController.js';
import { addReview, getReviews } from '../controllers/sessionReviewController.js';

const router = express.Router();

router.post('/schedule', createSession);

router.put('/reschedule/:id', rescheduleSession);

router.delete('/delete/:id', cancelSession);

router.get('/availability', getSessionAvailability);

router.post('/review/:id', addReview);

router.get('/review/:id', getReviews);

router.post('/enroll/', enrollUserIntoSession);

router.delete('/unenroll', removeUserFromSession);

export default router;
