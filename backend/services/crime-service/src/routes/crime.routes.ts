import { Router } from 'express';
import { crimeController } from '../controllers/crime.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public endpoint - anonymous FIR registration allowed
router.post('/', (req, res, next) => crimeController.registerFIR(req, res, next));

// Authenticated endpoints
router.get(
  '/:id',
  authenticate,
  (req, res, next) => crimeController.getFIR(req, res, next)
);

router.get(
  '/',
  authenticate,
  (req, res, next) => crimeController.searchFIRs(req, res, next)
);

router.get(
  '/stats',
  authenticate,
  authorize('OFFICER', 'ADMIN'),
  (req, res, next) => crimeController.getStatistics(req, res, next)
);

// Officer/Admin only endpoints
router.put(
  '/:id/status',
  authenticate,
  authorize('OFFICER', 'ADMIN'),
  (req, res, next) => crimeController.updateStatus(req, res, next)
);

router.post(
  '/:id/assign',
  authenticate,
  authorize('ADMIN'),
  (req, res, next) => crimeController.assignOfficer(req, res, next)
);

export default router;
