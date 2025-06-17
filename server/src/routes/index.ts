import express from 'express';
import userRoutes from '@routes/userRoutes';
import terminalLogRoutes from '@routes/terminalLogRoutes';
import sshConnectionRoute from '@routes/sshConnectionRoutes'

const router = express.Router();

router.use('/users', userRoutes);
router.use('/terminalLog', terminalLogRoutes);
router.use('/sshConnection', sshConnectionRoute)

export default router;