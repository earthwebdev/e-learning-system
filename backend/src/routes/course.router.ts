import express from 'express';
import multer from 'multer';
import { authMiddleware, authorize } from '../middlewares/auth.middleware';
import { getCourses } from '../controllers/courses.controller';
import upload from '../middlewares/multer.middlewares';
import CourseModel from '../models/courses.model';
import  filteredResults  from '../middlewares/filteredResults.middleware';
import CourseInterface from '../interface/course.interface';

const router = express.Router();

//const upload = multer('photo', 'multipart/form-data');
//const upload = multer({ storage: storage });
router.get('/', authMiddleware, filteredResults(CourseModel), getCourses);
/* router.post('/', authMiddleware, authorize('instructor', 'admin'), upload.single('photo'), addCourses);
router.patch('/:id', authMiddleware, authorize('instructor', 'admin'), upload.single('photo'), updateCourses);
router.delete('/:id', authMiddleware, authorize('instructor', 'admin'), deleteCourses); */

export default router;