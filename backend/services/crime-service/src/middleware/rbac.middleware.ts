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
 * Permission matrix for FIR actions
 */
export const firPermissions = {
  create: ['CITIZEN', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'],
  read: ['CITIZEN', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'],
  update: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
  delete: ['ADMIN', 'SUPER_ADMIN'],
  assign: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
  investigate: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
};
