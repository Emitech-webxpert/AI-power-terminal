import express from 'express';
import  { createTerminalLogController, getTerminalLogController } from '@controllers/terminalLogController';

const router = express.Router();

router.post('/createTerminalLog', createTerminalLogController);

router.get('/:id', getTerminalLogController);

export default router;