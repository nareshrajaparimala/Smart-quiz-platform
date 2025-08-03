const mongoose = require('mongoose');

const questionResponseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  quizAttemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizAttempt',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedAnswerIndex: {
    type: Number,
    min: 0,
    max: 3,
    default: null
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  responseTime: {
    type: Number, // in seconds
    required: true,
    min: 0,
    max: 20
  },
  wasAttempted: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
});

questionResponseSchema.index({ userId: 1 });
questionResponseSchema.index({ quizAttemptId: 1 });
questionResponseSchema.index({ questionId: 1 });
questionResponseSchema.index({ userId: 1, questionId: 1 });

module.exports = mongoose.model('QuestionResponse', questionResponseSchema);