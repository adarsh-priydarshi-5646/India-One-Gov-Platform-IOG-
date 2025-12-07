import { Request, Response, NextFunction } from 'express';

export type UserRole = 'CITIZEN' | 'OFFICER' | 'POLITICIAN' | 'ADMIN' | 'SUPER_ADMIN';

// Role hierarchy: SUPER_ADMIN > ADMIN > OFFICER > POLITICIAN > CITIZEN
const roleHierarchy: Record<UserRole, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  OFFICER: 3,
  POLITICIAN: 2,
  CITIZEN: 1,
};

/**
 * Check if user has required role or higher
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const userRole = user.role as UserRole;
      const userRoleLevel = roleHierarchy[userRole] || 0;

      // Check if user has any of the allowed roles or higher
      const hasPermission = allowedRoles.some(
        (role) => userRoleLevel >= roleHierarchy[role]
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user owns the resource or has admin privileges
 */
export const authorizeOwnerOrAdmin = (userIdField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const userRole = user.role as UserRole;
      const resourceUserId = req.params[userIdField] || req.body[userIdField];

      // Allow if user is admin or super admin
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        return next();
      }

      // Allow if user owns the resource
      if (user.id === resourceUserId || user._id?.toString() === resourceUserId) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources',
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Permission matrix for complaint actions
 */
export const complaintPermissions = {
  create: ['CITIZEN', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'],
  read: ['CITIZEN', 'OFFICER', 'POLITICIAN', 'ADMIN', 'SUPER_ADMIN'],
  update: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
  delete: ['ADMIN', 'SUPER_ADMIN'],
  assign: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
  escalate: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
  feedback: ['CITIZEN'],
};
