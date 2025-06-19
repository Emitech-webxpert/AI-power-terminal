import express from 'express';
import user from '@routes/user';
import terminalLog from '@routes/terminalLog';
import sshConnection from '@routes/sshConnection'

const router = express.Router();

router.use('/users', user);
router.use('/terminalLog', terminalLog);
router.use('/sshConnection', sshConnection)

export default router;