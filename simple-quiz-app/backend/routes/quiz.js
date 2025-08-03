const express = require('express');
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/auth');
const { validateQuizStart, validateAnswerSubmission } = require('../middleware/validation');

const router = express.Router();

router.use(authMiddleware); // All quiz routes require authentication

router.get('/topics', quizController.getTopics);
router.post('/start', validateQuizStart, quizController.startQuiz);
router.post('/submit-answer', validateAnswerSubmission, quizController.submitAnswer);
router.post('/complete', quizController.completeQuiz);

module.exports = router;