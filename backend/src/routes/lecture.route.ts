import express from 'express';
import multer from 'multer';
import { authMiddleware, authorize } from '../middlewares/auth.middleware';
import { getLectures, addLectures, updateLectures, deleteLectures } from '../controllers/lectures.controller';
import upload from '../middlewares/multer.middlewares';
import LectureModel from '../models/lecture.model';
import  filteredResults  from '../middlewares/filteredResults.middleware';
import LectureInterface from '../interface/lectures.interface';

const router = express.Router();

//const upload = multer('photo', 'multipart/form-data');
//const upload = multer({ storage: storage });
router.get('/', authMiddleware, filteredResults(LectureModel), getLectures);
router.post('/', authMiddleware, authorize('instructor', 'admin'), upload.single('photo'), addLectures);
router.patch('/:id', authMiddleware, authorize('instructor', 'admin'), upload.single('photo'), updateLectures);
router.delete('/:id', authMiddleware, authorize('instructor', 'admin'), deleteLectures);

export default router;