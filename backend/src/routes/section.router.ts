import express from 'express';
import { addSections } from '../controllers/sections.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from 'passport';

const router = express();

//router.post('/', authMiddleware, authorize(['instructor', 'admin']), addSections);

export default router;