import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.mjs';
import emailService from './emailService.mjs';

class AuthService {
  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  async register(userData) {
    const { userId, password, email } = userData;
    
    // Check if user ID already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      throw new Error('USER_ID_EXISTS');
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new Error('EMAIL_EXISTS');
    }

    const user = new User({ userId, password, email });
    await user.save();

    const token = this.generateToken(userId);
    return { user: { userId, email }, token };
  }

  async login(userId, password) {
    const user = await User.findOne({ userId, isActive: true });
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }

    await user.updateLastLogin();
    const token = this.generateToken(userId);
    
    return {
      user: {
        userId: user.userId,
        email: user.email,
        lastLoginAt: user.lastLoginAt
      },
      token
    };
  }

  async initiatePasswordReset(email) {
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If email exists, reset instructions sent' };
    }

    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await emailService.sendPasswordResetEmail(email, resetToken);
    return { message: 'Password reset email sent' };
  }

  async resetPassword(email, verificationCode, newPassword) {
    const user = await User.findOne({
      email,
      resetPasswordToken: verificationCode,
      resetPasswordExpires: { $gt: Date.now() },
      isActive: true
    });

    if (!user) {
      throw new Error('INVALID_RESET_TOKEN');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  async validateUserId(userId) {
    const existingUser = await User.findOne({ userId });
    return { available: !existingUser };
  }
}

export default new AuthService();