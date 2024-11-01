import AdminRoutes from './Admin/index.js';
import UserRoutes from './User/index.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(cookieParser());
router.use('/admin', AdminRoutes);


router.use('/user', UserRoutes);
export default router;
