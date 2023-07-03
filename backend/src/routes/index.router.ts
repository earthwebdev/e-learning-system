import express from 'express';
import userRouter from './user.router';
import authRouter from './auth.router';
import sectionRouter from './section.router';
import lectureRouter from  './lecture.route';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
//router.use('/courses', userRouter);
//router.use('/sections', sectionRouter);
router.use('/lectures', lectureRouter);
export default router;