const quizService = require('../services/quizService');

class QuizController {
  async getTopics(req, res, next) {
    try {
      const result = await quizService.getTopics(req.user.userId);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async startQuiz(req, res, next) {
    try {
      const { topicId } = req.body;
      const result = await quizService.startQuiz(req.user.userId, topicId);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error.message === 'MAX_ATTEMPTS_REACHED') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'MAX_ATTEMPTS_REACHED',
            message: 'Maximum 3 attempts reached for this topic. Score 50% or higher to unlock unlimited attempts.'
          }
        });
      }
      if (error.message === 'INSUFFICIENT_QUESTIONS') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_QUESTIONS',
            message: 'Not enough questions available for this topic'
          }
        });
      }
      next(error);
    }
  }

  async submitAnswer(req, res, next) {
    try {
      const { quizAttemptId, questionId, selectedAnswerIndex, responseTime } = req.body;
      const result = await quizService.submitAnswer(
        req.user.userId,
        quizAttemptId,
        questionId,
        selectedAnswerIndex,
        responseTime
      );
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error.message === 'QUIZ_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'QUIZ_NOT_FOUND',
            message: 'Quiz attempt not found or already completed'
          }
        });
      }
      next(error);
    }
  }

  async completeQuiz(req, res, next) {
    try {
      const { quizAttemptId } = req.body;
      const result = await quizService.completeQuiz(req.user.userId, quizAttemptId);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuizController();