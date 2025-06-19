import express from 'express';
import userRoutes from '@routes/user';
import terminalLogRoutes from '@routes/terminalLog';
import sshConnectionRoute from '@routes/sshConnection'

const router = express.Router();

router.use('/users', userRoutes);
router.use('/terminalLog', terminalLogRoutes);
router.use('/sshConnection', sshConnectionRoute)

export default router;