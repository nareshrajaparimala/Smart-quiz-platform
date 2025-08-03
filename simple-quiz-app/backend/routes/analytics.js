const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware); // All analytics routes require authentication

router.get('/dashboard', analyticsController.getDashboard);
router.get('/question-performance', analyticsController.getQuestionPerformance);
router.get('/export', analyticsController.exportReport);

module.exports = router;