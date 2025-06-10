import express from 'express';
import { createUserController, getUserByIdController } from '@controllers/index';

const router = express.Router();

router.post('/createUser', createUserController);

router.get('/:id', getUserByIdController);

export default router;