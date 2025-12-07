import { Router } from 'express';
import { complaintController } from '../controllers/complaint.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { upload, handleMulterError } from '../middleware/upload.middleware';

const router = Router();

/**
 * Public endpoints (require authentication but any role)
 */
router.post(
  '/',
  authenticate,
  authorize('CITIZEN', 'OFFICER', 'ADMIN'),
  upload.array('files', 5),
  handleMulterError,
  (req, res, next) => complaintController.createComplaint(req, res, next)
);

router.get(
  '/:id',
  authenticate,
  (req, res, next) => complaintController.getComplaint(req, res, next)
);

router.get(
  '/',
  authenticate,
  (req, res, next) => complaintController.searchComplaints(req, res, next)
);

router.get(
  '/stats',
  authenticate,
  (req, res, next) => complaintController.getStatistics(req, res, next)
);

/**
 * Citizen-only endpoints
 */
router.post(
  '/:id/feedback',
  authenticate,
  authorize('CITIZEN'),
  (req, res, next) => complaintController.submitFeedback(req, res, next)
);

router.post(
  '/:id/evidence',
  authenticate,
  authorize('CITIZEN', 'OFFICER'),
  upload.array('files', 5),
  handleMulterError,
  (req, res, next) => complaintController.uploadEvidence(req, res, next)
);

/**
 * Officer/Admin endpoints
 */
router.put(
  '/:id/status',
  authenticate,
  authorize('OFFICER', 'ADMIN'),
  (req, res, next) => complaintController.updateStatus(req, res, next)
);

router.post(
  '/:id/assign',
  authenticate,
  authorize('ADMIN'),
  (req, res, next) => complaintController.assignComplaint(req, res, next)
);

router.post(
  '/:id/escalate',
  authenticate,
  authorize('OFFICER', 'ADMIN'),
  (req, res, next) => complaintController.escalateComplaint(req, res, next)
);

export default router;
