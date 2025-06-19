import express from 'express';
import { user } from '@controllers/index';

const router = express.Router();

router.post('/signUp', user.SignUp);
router.get('/:id', user.getUserById);
router.post(`/signIn`, user.SignIn)

export default router;