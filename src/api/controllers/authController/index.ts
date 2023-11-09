import { Router } from 'express';
import { loginWithCode } from './authController';

const router = Router();

// router.post('/signup', signup);
// router.post('/login', login);
router.post('/code-login', loginWithCode);

export default router;
