import express from 'express';
import { getAllNotes, createAndSaveNote, deleteNote } from '../controllers/notesController.js';

const router = express.Router();

router.get('/fetch', getAllNotes);
router.post('/create', createAndSaveNote);
router.delete('/delete/:id', deleteNote);

export default router;