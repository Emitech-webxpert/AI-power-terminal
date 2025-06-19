import express from 'express';
import  { createTerminalLogController, getTerminalLogController } from '@controllers/terminalLog';

const router = express.Router();

router.post('/createTerminalLog', createTerminalLogController);

router.get('/:id', getTerminalLogController);

export default router;