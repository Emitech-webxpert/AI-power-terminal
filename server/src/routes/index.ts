import express from 'express';
import userRoutes from '@routes/userRoutes';
import terminalLogRoutes from '@routes/terminalLogRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/terminalLog', terminalLogRoutes);

export default router;