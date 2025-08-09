import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  shuffledQuestions: [{
    _id: mongoose.Schema.Types.ObjectId,
    questionText: String,
    options: [String],
    correctAnswerIndex: Number,
    originalCorrectIndex: Number,
    mediaUrl: String,
    mediaType: String
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 10
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  attemptNumber: {
    type: Number,
    required: true,
    min: 1
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  passedThreshold: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate if passed threshold (50% = 5 points)
quizAttemptSchema.pre('save', function(next) {
  if (this.isCompleted) {
    this.passedThreshold = this.score >= 5;
  }
  next();
});

quizAttemptSchema.index({ userId: 1 });
quizAttemptSchema.index({ topicId: 1 });
quizAttemptSchema.index({ userId: 1, topicId: 1 });
quizAttemptSchema.index({ completedAt: -1 });

export default mongoose.model('QuizAttempt', quizAttemptSchema);