import express from 'express';
import { getAllNotes, createAndSaveNote, deleteNote, editSessionNotes } from '../controllers/notesController.js';

const router = express.Router();

router.get('/fetch', getAllNotes);
router.post('/create', createAndSaveNote);
router.delete('/delete/:id', deleteNote);
router.put("/edit", editSessionNotes);

export default router;