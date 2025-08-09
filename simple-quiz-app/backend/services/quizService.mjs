import Topic from '../models/Topic.mjs';
import Question from '../models/Question.mjs';
import QuizAttempt from '../models/QuizAttempt.mjs';
import QuestionResponse from '../models/QuestionResponse.mjs';
import User from '../models/User.mjs';
import mongoose from 'mongoose';

class QuizService {
  async getTopics(userId) {
    const topics = await Topic.find({ isActive: true });
    const topicsWithAttempts = await Promise.all(
      topics.map(async (topic) => {
        const attempts = await QuizAttempt.find({
          userId,
          topicId: topic._id,
          isCompleted: true
        }).sort({ completedAt: -1 });

        const passedAttempts = attempts.filter(a => a.passedThreshold);
        const canRetake = attempts.length < 3 || passedAttempts.length > 0;
        const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;

        return {
          _id: topic._id,
          name: topic.name,
          description: topic.description,
          questionCount: topic.questionCount,
          userAttempts: attempts.length,
          maxAttempts: 3,
          canRetake,
          bestScore
        };
      })
    );

    return { topics: topicsWithAttempts };
  }

  async startQuiz(userId, topicId) {

    const objectId = new mongoose.Types.ObjectId(topicId);
    
    // Check if user can take this quiz
    const attempts = await QuizAttempt.find({
      userId,
      topicId: objectId,
      isCompleted: true
    });

    const passedAttempts = attempts.filter(a => a.passedThreshold);
    if (attempts.length >= 3 && passedAttempts.length === 0) {
      throw new Error('MAX_ATTEMPTS_REACHED');
    }

    // Get random questions
    const questions = await Question.aggregate([
      { $match: { topicId: objectId, isActive: true } },
      { $sample: { size: 10 } }
    ]);

    if (questions.length < 10) {
      // If we don't have enough questions, get all available
      const allQuestions = await Question.find({ topicId: objectId, isActive: true });
      if (allQuestions.length === 0) {
        throw new Error('INSUFFICIENT_QUESTIONS');
      }
      
      // Use all available questions
      questions.splice(0, questions.length, ...allQuestions.slice(0, 10));
    }

    // Randomize answer options for each question
    const questionsWithRandomizedOptions = questions.map(q => {
      const options = [...q.options];
      const correctAnswer = options[q.correctAnswerIndex];
      
      // Fisher-Yates shuffle
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      
      const newCorrectIndex = options.indexOf(correctAnswer);
      
      return {
        _id: q._id,
        questionText: q.questionText,
        options,
        correctAnswerIndex: newCorrectIndex,
        originalCorrectIndex: q.correctAnswerIndex,
        mediaUrl: q.mediaUrl,
        mediaType: q.mediaType
      };
    });

    // Create quiz attempt with shuffled question data
    const quizAttempt = new QuizAttempt({
      userId,
      topicId: objectId,
      questions: questions.map(q => q._id),
      shuffledQuestions: questionsWithRandomizedOptions,
      attemptNumber: attempts.length + 1
    });
    await quizAttempt.save();

    const topic = await Topic.findById(objectId);
    
    return {
      quizAttemptId: quizAttempt._id,
      topicName: topic.name,
      questions: questionsWithRandomizedOptions,
      totalQuestions: 10,
      timePerQuestion: 20,
      attemptNumber: quizAttempt.attemptNumber
    };
  }

  async submitAnswer(userId, quizAttemptId, questionId, selectedAnswerIndex, responseTime) {
    const quizAttempt = await QuizAttempt.findOne({
      _id: quizAttemptId,
      userId,
      isCompleted: false
    });

    if (!quizAttempt) {
      throw new Error('QUIZ_NOT_FOUND');
    }

    // Find the shuffled question data
    const shuffledQuestion = quizAttempt.shuffledQuestions?.find(q => q._id.toString() === questionId) || 
                            await Question.findById(questionId);
    
    if (!shuffledQuestion) {
      throw new Error('QUESTION_NOT_FOUND');
    }

    const isCorrect = selectedAnswerIndex === shuffledQuestion.correctAnswerIndex;
    const wasAttempted = selectedAnswerIndex !== null && responseTime < 20;

    // Save response
    const response = new QuestionResponse({
      userId,
      quizAttemptId,
      questionId,
      selectedAnswerIndex,
      isCorrect,
      responseTime,
      wasAttempted
    });
    await response.save();

    // Check if quiz is complete
    const totalResponses = await QuestionResponse.countDocuments({ quizAttemptId });
    const currentQuestionIndex = quizAttempt.questions.findIndex(q => q.toString() === questionId);
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (totalResponses >= 10 || nextQuestionIndex >= quizAttempt.questions.length) {
      return await this.completeQuiz(userId, quizAttemptId);
    }

    // Get next question from shuffled data
    const nextQuestionId = quizAttempt.questions[nextQuestionIndex];
    const nextShuffledQuestion = quizAttempt.shuffledQuestions?.find(q => q._id.toString() === nextQuestionId.toString());
    
    if (!nextShuffledQuestion) {
      // Fallback to original question if shuffled data not found
      const nextQuestion = await Question.findById(nextQuestionId);
      return {
        isCorrect,
        nextQuestion: {
          _id: nextQuestion._id,
          questionText: nextQuestion.questionText,
          options: nextQuestion.options,
          correctAnswerIndex: nextQuestion.correctAnswerIndex,
          mediaUrl: nextQuestion.mediaUrl,
          mediaType: nextQuestion.mediaType
        },
        progress: {
          currentQuestion: nextQuestionIndex + 1,
          totalQuestions: 10
        }
      };
    }
    
    return {
      isCorrect,
      nextQuestion: {
        _id: nextShuffledQuestion._id,
        questionText: nextShuffledQuestion.questionText,
        options: nextShuffledQuestion.options,
        correctAnswerIndex: nextShuffledQuestion.correctAnswerIndex,
        mediaUrl: nextShuffledQuestion.mediaUrl,
        mediaType: nextShuffledQuestion.mediaType
      },
      progress: {
        currentQuestion: nextQuestionIndex + 1,
        totalQuestions: 10
      }
    };
  }

  async completeQuiz(userId, quizAttemptId) {
    const quizAttempt = await QuizAttempt.findOne({
      _id: quizAttemptId,
      userId
    }).populate('questions');

    if (!quizAttempt) {
      throw new Error('QUIZ_NOT_FOUND');
    }

    const responses = await QuestionResponse.find({ quizAttemptId });
    const score = responses.filter(r => r.isCorrect).length;
    const totalTime = responses.reduce((sum, r) => sum + r.responseTime, 0);
    const unattemptedCount = responses.filter(r => !r.wasAttempted).length;

    // Update quiz attempt
    quizAttempt.score = score;
    quizAttempt.timeSpent = totalTime;
    quizAttempt.completedAt = new Date();
    quizAttempt.isCompleted = true;
    quizAttempt.passedThreshold = score >= 5;
    await quizAttempt.save();
    
    // Update user retention for analytics tracking
    await User.findOneAndUpdate(
      { userId },
      { retentionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    );

    // Prepare question review
    const questionReview = await Promise.all(
      quizAttempt.questions.map(async (question) => {
        const response = responses.find(r => r.questionId.toString() === question._id.toString());
        return {
          questionId: question._id,
          questionText: question.questionText,
          options: question.options,
          correctAnswerIndex: question.correctAnswerIndex,
          userAnswerIndex: response?.selectedAnswerIndex || null,
          isCorrect: response?.isCorrect || false,
          responseTime: response?.responseTime || 20
        };
      })
    );

    return {
      quizResults: {
        score,
        totalQuestions: 10,
        percentage: (score / 10) * 100,
        timeSpent: totalTime,
        passed: score >= 5
      },
      questionReview,
      performance: {
        averageResponseTime: totalTime / 10,
        unattemptedQuestions: unattemptedCount
      }
    };
  }
}

export default new QuizService();