import express, { Router } from 'express';
import { userLoginController, userRegisteredController, getUsersListForAdmin } from '../controllers/users.controller';
import {authMiddleware, authorize} from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/login', userLoginController);

router.post('/register', userRegisteredController);


router.get('/admin', authMiddleware, authorize(['admin']), getUsersListForAdmin);

export default router;