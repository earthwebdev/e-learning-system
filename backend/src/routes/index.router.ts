import express from 'express';
import userRouter from './user.router';
import authRouter from './auth.router';
import courseRouter from './course.router'
import sectionRouter from './section.router';
import lectureRouter from  './lecture.route';
import stripeRouter from './stripe.router';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/courses', courseRouter);
router.use('/sections', sectionRouter);
router.use('/lectures', lectureRouter);
router.use('/stripe', stripeRouter);
export default router;