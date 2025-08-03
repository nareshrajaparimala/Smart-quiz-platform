const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswerIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  mediaUrl: {
    type: String,
    default: null
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', null],
    default: null
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Validate exactly 4 options
questionSchema.pre('save', function(next) {
  if (this.options.length !== 4) {
    return next(new Error('Question must have exactly 4 options'));
  }
  next();
});

questionSchema.index({ topicId: 1 });
questionSchema.index({ isActive: 1 });
questionSchema.index({ topicId: 1, isActive: 1 });

module.exports = mongoose.model('Question', questionSchema);