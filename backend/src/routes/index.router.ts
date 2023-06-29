import express, {Request, Response} from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import userRouter from './user.router';
import authRouter from './auth.router';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);

export default router;