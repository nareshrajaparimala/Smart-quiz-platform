const express = require('express');
const authMiddleware = require('../middleware/auth');
const authService = require('../services/authService');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        userId: user.userId,
        email: user.email,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        retentionExpiry: user.retentionExpiry
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/validate-id', async (req, res, next) => {
  try {
    const { userId } = req.body;
    const result = await authService.validateUserId(userId);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;