import express from 'express';
import  { TerminalLog } from '@controllers/index';

const router = express.Router();

router.post('/createTerminalLog', TerminalLog.createTerminalLog);

router.get('/:id', TerminalLog.getTerminalLog);

export default router;