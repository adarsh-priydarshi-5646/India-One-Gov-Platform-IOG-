import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate, attachUser } from '../middleware/auth.middleware';

const router = Router();

/**
 * Public routes (no authentication required)
 */
router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/verify-otp', (req, res, next) => authController.verifyOTP(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/refresh', (req, res, next) => authController.refreshToken(req, res, next));

/**
 * Protected routes (authentication required)
 */
router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));
router.get('/me', authenticate, attachUser, (req, res, next) => authController.getCurrentUser(req, res, next));

export default router;
