import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

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
        throw new AppError('Authentication required', 401);
      }

      const userRole = user.role as UserRole;
      const userRoleLevel = roleHierarchy[userRole] || 0;

      // Check if user has any of the allowed roles or higher
      const hasPermission = allowedRoles.some(
        (role) => userRoleLevel >= roleHierarchy[role]
      );

      if (!hasPermission) {
        throw new AppError(
          `Access denied. Required role: ${allowedRoles.join(' or ')}`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user has exact role
 */
export const requireExactRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        throw new AppError('Authentication required', 401);
      }

      const userRole = user.role as UserRole;

      if (!roles.includes(userRole)) {
        throw new AppError(
          `Access denied. Required exact role: ${roles.join(' or ')}`,
          403
        );
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
        throw new AppError('Authentication required', 401);
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

      throw new AppError('Access denied. You can only access your own resources', 403);
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user can access resources in their jurisdiction (state/district)
 */
export const authorizeJurisdiction = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        throw new AppError('Authentication required', 401);
      }

      const userRole = user.role as UserRole;

      // Super admin and admin can access all
      if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
        return next();
      }

      // Officers and politicians can only access their jurisdiction
      const resourceState = req.query.state || req.body.state;
      const resourceDistrict = req.query.district || req.body.district;

      if (userRole === 'OFFICER' || userRole === 'POLITICIAN') {
        if (user.state && resourceState && user.state !== resourceState) {
          throw new AppError('Access denied. Resource outside your jurisdiction', 403);
        }

        if (user.district && resourceDistrict && user.district !== resourceDistrict) {
          throw new AppError('Access denied. Resource outside your jurisdiction', 403);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Permission matrix for different actions
 */
export const permissions = {
  // Complaint permissions
  complaint: {
    create: ['CITIZEN', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    read: ['CITIZEN', 'OFFICER', 'POLITICIAN', 'ADMIN', 'SUPER_ADMIN'],
    update: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    delete: ['ADMIN', 'SUPER_ADMIN'],
    assign: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
  },
  // FIR permissions
  fir: {
    create: ['CITIZEN', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    read: ['CITIZEN', 'OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    update: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    delete: ['ADMIN', 'SUPER_ADMIN'],
  },
  // User management permissions
  user: {
    create: ['ADMIN', 'SUPER_ADMIN'],
    read: ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    update: ['ADMIN', 'SUPER_ADMIN'],
    delete: ['SUPER_ADMIN'],
    changeRole: ['SUPER_ADMIN'],
  },
  // Analytics permissions
  analytics: {
    view: ['OFFICER', 'POLITICIAN', 'ADMIN', 'SUPER_ADMIN'],
    export: ['ADMIN', 'SUPER_ADMIN'],
  },
};

/**
 * Check specific permission
 */
export const checkPermission = (resource: keyof typeof permissions, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        throw new AppError('Authentication required', 401);
      }

      const userRole = user.role as UserRole;
      const allowedRoles = (permissions[resource] as any)[action] as UserRole[];

      if (!allowedRoles || !allowedRoles.includes(userRole)) {
        throw new AppError(
          `Access denied. Insufficient permissions for ${resource}.${action}`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
