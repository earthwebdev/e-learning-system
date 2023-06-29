import express, { Router } from 'express';
import { userLoginController, userRegisteredController } from '../controllers/users.controller';

const router = express.Router();

router.post('/login', userLoginController);

router.post('/register', userRegisteredController);

export default router;