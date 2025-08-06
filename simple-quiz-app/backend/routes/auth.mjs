import express from 'express';
import authController from '../controllers/authController.mjs';
import { validateRegistration, validateLogin } from '../middleware/validation.mjs';

const router = express.Router();

router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;