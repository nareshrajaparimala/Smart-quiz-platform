const authService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error.message === 'USER_ID_EXISTS') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'USER_ID_EXISTS',
            message: 'User ID already exists. Please choose a different ID.'
          }
        });
      }
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { userId, password } = req.body;
      const result = await authService.login(userId, password);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid user ID or password'
          }
        });
      }
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.initiatePasswordReset(email);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, verificationCode, newPassword } = req.body;
      const result = await authService.resetPassword(email, verificationCode, newPassword);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      if (error.message === 'INVALID_RESET_TOKEN') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_RESET_TOKEN',
            message: 'Invalid or expired verification code'
          }
        });
      }
      next(error);
    }
  }
}

module.exports = new AuthController();