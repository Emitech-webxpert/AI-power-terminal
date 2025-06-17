import express from 'express';
import { userController } from '@controllers/index';

const router = express.Router();

router.post('/createUser', userController.createUserController);

router.get('/:id', userController.getUserByIdController);

export default router;