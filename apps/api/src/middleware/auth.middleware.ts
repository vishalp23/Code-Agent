import { Request, Response, NextFunction } from 'express';
import { supabaseService } from '../services/supabase.service';
import { logger } from '../utils/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        user_metadata?: any;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const user = await supabaseService.verifyToken(token);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
    };

    logger.info(`Authenticated user: ${user.email} (${user.id})`);
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

// Optional: Middleware to check if user is admin
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
    return;
  }

  const isAdmin = req.user.user_metadata?.isAdmin === true;

  if (!isAdmin) {
    res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
    return;
  }

  next();
};
