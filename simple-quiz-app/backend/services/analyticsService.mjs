import QuizAttempt from '../models/QuizAttempt.mjs';
import QuestionResponse from '../models/QuestionResponse.mjs';
import Topic from '../models/Topic.mjs';

class AnalyticsService {
  async getDashboardAnalytics(userId) {
    // Overall stats
    const totalQuizzes = await QuizAttempt.countDocuments({ 
      userId, 
      isCompleted: true 
    });

    const quizzes = await QuizAttempt.find({ 
      userId, 
      isCompleted: true 
    }).sort({ completedAt: -1 });

    const averageScore = quizzes.length > 0 
      ? quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length 
      : 0;

    const responses = await QuestionResponse.find({ userId });
    const averageResponseTime = responses.length > 0
      ? responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length
      : 0;

    const totalCorrectAnswers = responses.filter(r => r.isCorrect).length;
    const totalQuestions = responses.length;
    const unattemptedQuestions = responses.filter(r => !r.wasAttempted).length;

    // Recent quizzes (last 5 or all if growth tracking)
    const recentQuizzes = await QuizAttempt.find({ 
      userId, 
      isCompleted: true,
      topicId: { $exists: true, $ne: null }
    })
    .populate('topicId', 'name')
    .sort({ completedAt: -1 })
    .limit(totalQuizzes > 5 ? totalQuizzes : 5)
    .select('topicId score completedAt timeSpent');

    const recentQuizzesFormatted = recentQuizzes
      .filter(quiz => quiz.topicId)
      .map(quiz => ({
        quizAttemptId: quiz._id,
        topicName: quiz.topicId.name,
        score: quiz.score,
        completedAt: quiz.completedAt,
        timeSpent: quiz.timeSpent
      }));

    // Topic-wise stats
    const topicStats = await this.getTopicStats(userId);

    return {
      overallStats: {
        totalQuizzes,
        averageScore,
        averageResponseTime,
        totalCorrectAnswers,
        totalQuestions,
        unattemptedQuestions
      },
      recentQuizzes: recentQuizzesFormatted,
      topicStats
    };
  }

  async getTopicStats(userId) {
    const topics = await Topic.find({ isActive: true });
    const topicStats = [];

    for (const topic of topics) {
      const quizzes = await QuizAttempt.find({
        userId,
        topicId: topic._id,
        isCompleted: true
      }).sort({ completedAt: -1 });

      if (quizzes.length > 0) {
        const averageScore = quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length;
        const bestScore = Math.max(...quizzes.map(q => q.score));
        const lastAttemptDate = quizzes[0].completedAt;

        // Calculate average response time for this topic
        const topicResponses = await QuestionResponse.find({
          userId,
          quizAttemptId: { $in: quizzes.map(q => q._id) }
        });

        const averageResponseTime = topicResponses.length > 0
          ? topicResponses.reduce((sum, r) => sum + r.responseTime, 0) / topicResponses.length
          : 0;

        // Count current attempts (for retake logic)
        const currentAttemptCount = quizzes.filter(q => !q.passedThreshold).length;

        topicStats.push({
          topicId: topic._id,
          topicName: topic.name,
          quizzesTaken: quizzes.length,
          averageScore,
          averageResponseTime,
          bestScore,
          lastAttemptDate,
          currentAttemptCount: Math.min(currentAttemptCount, 3)
        });
      }
    }

    return topicStats;
  }

  async getQuestionPerformance(userId, filters = {}) {
    const matchStage = { userId };
    
    if (filters.topicId) {
      // Get questions for specific topic
      const quizzes = await QuizAttempt.find({
        userId,
        topicId: filters.topicId,
        isCompleted: true
      });
      matchStage.quizAttemptId = { $in: quizzes.map(q => q._id) };
    }

    const questionPerformance = await QuestionResponse.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$questionId',
          timesAttempted: { $sum: 1 },
          timesCorrect: { $sum: { $cond: ['$isCorrect', 1, 0] } },
          totalResponseTime: { $sum: '$responseTime' },
          lastAttempted: { $max: '$timestamp' }
        }
      },
      {
        $addFields: {
          accuracyRate: {
            $multiply: [
              { $divide: ['$timesCorrect', '$timesAttempted'] },
              100
            ]
          },
          averageResponseTime: {
            $divide: ['$totalResponseTime', '$timesAttempted']
          }
        }
      },
      { $sort: { lastAttempted: -1 } },
      { $limit: filters.limit || 50 }
    ]);

    // Populate question details
    const populatedPerformance = await Promise.all(
      questionPerformance.map(async (perf) => {
        const question = await QuestionResponse.findOne({ questionId: perf._id })
          .populate({
            path: 'questionId',
            populate: { path: 'topicId', select: 'name' }
          });

        return {
          questionId: perf._id,
          questionText: question?.questionId?.questionText || 'Question not found',
          topicName: question?.questionId?.topicId?.name || 'Unknown',
          timesAttempted: perf.timesAttempted,
          timesCorrect: perf.timesCorrect,
          accuracyRate: perf.accuracyRate,
          averageResponseTime: perf.averageResponseTime,
          lastAttempted: perf.lastAttempted
        };
      })
    );

    // Calculate summary
    const totalQuestionsAttempted = questionPerformance.length;
    const overallAccuracy = questionPerformance.length > 0
      ? questionPerformance.reduce((sum, q) => sum + q.accuracyRate, 0) / questionPerformance.length
      : 0;
    const overallAvgResponseTime = questionPerformance.length > 0
      ? questionPerformance.reduce((sum, q) => sum + q.averageResponseTime, 0) / questionPerformance.length
      : 0;

    return {
      questionPerformance: populatedPerformance,
      summary: {
        totalQuestionsAttempted,
        overallAccuracy,
        averageResponseTime: overallAvgResponseTime
      }
    };
  }

  async generateReportData(userId, period = 'all') {
    let dateFilter = {};
    
    if (period === 'last30days') {
      dateFilter = { completedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'last7days') {
      dateFilter = { completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    }

    const quizzes = await QuizAttempt.find({
      userId,
      isCompleted: true,
      ...dateFilter
    }).populate('topicId', 'name').sort({ completedAt: -1 });

    const responses = await QuestionResponse.find({
      userId,
      quizAttemptId: { $in: quizzes.map(q => q._id) }
    }).populate('questionId', 'questionText options correctAnswerIndex');

    return {
      period,
      generatedAt: new Date(),
      userId,
      summary: {
        totalQuizzes: quizzes.length,
        averageScore: quizzes.length > 0 
          ? quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length 
          : 0,
        totalTimeSpent: quizzes.reduce((sum, q) => sum + q.timeSpent, 0),
        passedQuizzes: quizzes.filter(q => q.passedThreshold).length
      },
      quizzes: quizzes.map(quiz => ({
        topic: quiz.topicId.name,
        score: quiz.score,
        percentage: (quiz.score / 10) * 100,
        timeSpent: quiz.timeSpent,
        completedAt: quiz.completedAt,
        passed: quiz.passedThreshold
      })),
      detailedResponses: responses.map(response => ({
        questionText: response.questionId.questionText,
        userAnswer: response.selectedAnswerIndex !== null 
          ? response.questionId.options[response.selectedAnswerIndex] 
          : 'Not attempted',
        correctAnswer: response.questionId.options[response.questionId.correctAnswerIndex],
        isCorrect: response.isCorrect,
        responseTime: response.responseTime,
        wasAttempted: response.wasAttempted
      }))
    };
  }
}

export default new AnalyticsService();