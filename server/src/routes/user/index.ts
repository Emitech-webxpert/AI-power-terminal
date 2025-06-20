import express from 'express';
// If '@controllers/user' exports the functions directly:
import { SignUp, getUserById, SignIn } from '@controllers/user';

const router = express.Router();
router.post('/signUp', SignUp);
router.get('/:id', getUserById);
router.post(`/signIn`, SignIn)

export default router;