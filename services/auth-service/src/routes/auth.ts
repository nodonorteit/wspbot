import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const authController = new AuthController();

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('tenantSlug').optional().isString()
];

const registerValidation = [
  body('name').isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('tenantName').isLength({ min: 2, max: 100 }),
  body('tenantSlug').optional().isString(),
  body('plan').optional().isIn(['free', 'basic', 'premium', 'enterprise'])
];

const refreshValidation = [
  body('refreshToken').isString().notEmpty()
];

// Routes
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/refresh', refreshValidation, validateRequest, authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export { router as authRoutes };
