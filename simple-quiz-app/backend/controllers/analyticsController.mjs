import analyticsService from '../services/analyticsService.mjs';

class AnalyticsController {
  async getDashboard(req, res, next) {
    try {
      const result = await analyticsService.getDashboardAnalytics(req.user.userId);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getQuestionPerformance(req, res, next) {
    try {
      const { topicId, limit } = req.query;
      const filters = {};
      
      if (topicId) filters.topicId = topicId;
      if (limit) filters.limit = parseInt(limit);

      const result = await analyticsService.getQuestionPerformance(req.user.userId, filters);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async exportReport(req, res, next) {
    try {
      const { format = 'pdf', period = 'all' } = req.query;
      
      const reportData = await analyticsService.generateReportData(req.user.userId, period);
      
      // For now, return the data - PDF generation would be implemented here
      res.json({
        success: true,
        data: {
          downloadUrl: `/api/v1/files/reports/${req.user.userId}_report_${Date.now()}.pdf`,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          fileSize: 245760,
          reportData // Include data for now
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();