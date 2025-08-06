import express from 'express';
import analyticsController from '../controllers/analyticsController.mjs';
import authMiddleware from '../middleware/auth.mjs';

const router = express.Router();

router.use(authMiddleware); // All analytics routes require authentication

router.get('/dashboard', analyticsController.getDashboard);
router.get('/question-performance', analyticsController.getQuestionPerformance);
router.get('/export', analyticsController.exportReport);

export default router;