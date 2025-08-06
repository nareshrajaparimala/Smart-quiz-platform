import express from 'express';
import quizController from '../controllers/quizController.mjs';
import authMiddleware from '../middleware/auth.mjs';
import { validateQuizStart, validateAnswerSubmission } from '../middleware/validation.mjs';

const router = express.Router();

router.use(authMiddleware); // All quiz routes require authentication

router.get('/topics', quizController.getTopics);
router.post('/start', validateQuizStart, quizController.startQuiz);
router.post('/submit-answer', validateAnswerSubmission, quizController.submitAnswer);
router.post('/complete', quizController.completeQuiz);

export default router;