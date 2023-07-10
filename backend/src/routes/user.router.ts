import express, { Router } from 'express';
import { userLoginController, userRegisteredController, userLogoutController, getUsersListForAdmin } from '../controllers/users.controller';
import {authMiddleware, authorize} from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/login', userLoginController);

router.post('/register', userRegisteredController);

router.get('/logout', authMiddleware, userLogoutController);

router.get('/admin', authMiddleware, authorize(['admin']), getUsersListForAdmin);

export default router;