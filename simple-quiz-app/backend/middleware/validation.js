const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: errors.array()
      }
    });
  }
  next();
};

const validateRegistration = [
  body('userId')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('User ID must be 3-20 alphanumeric characters'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  handleValidationErrors
];

const validateLogin = [
  body('userId')
    .notEmpty()
    .withMessage('User ID required'),
  body('password')
    .notEmpty()
    .withMessage('Password required'),
  handleValidationErrors
];

const validateQuizStart = [
  body('topicId')
    .isMongoId()
    .withMessage('Valid topic ID required'),
  handleValidationErrors
];

const validateAnswerSubmission = [
  body('quizAttemptId')
    .isMongoId()
    .withMessage('Valid quiz attempt ID required'),
  body('questionId')
    .isMongoId()
    .withMessage('Valid question ID required'),
  body('selectedAnswerIndex')
    .isInt({ min: 0, max: 3 })
    .withMessage('Answer index must be 0-3'),
  body('responseTime')
    .isFloat({ min: 0, max: 20 })
    .withMessage('Response time must be 0-20 seconds'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateQuizStart,
  validateAnswerSubmission,
  handleValidationErrors
};