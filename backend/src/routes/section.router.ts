import express from 'express';
import { addSections, getSections, getSectionsById, deleteSections } from '../controllers/sections.controller';
import { authMiddleware, authorize } from '../middlewares/auth.middleware';
import SectionModel from '../models/section.model';
import filteredResults from '../middlewares/filteredResults.middleware';
import upload from '../middlewares/multer.middlewares';
const router = express();

//router.post('/', authMiddleware, authorize(['instructor', 'admin']), addSections);
router.get('/', authMiddleware, filteredResults(SectionModel), getSections);
router.get('/:id', authMiddleware, getSectionsById);
router.post('/', authMiddleware, authorize('instructor', 'admin'), upload.array('photo'), addSections);

//router.patch('/:id', authMiddleware, authorize('instructor', 'admin'), updateSections); //upload.single('photo'),
router.delete('/:id', authMiddleware, authorize('instructor', 'admin'), deleteSections);

export default router;