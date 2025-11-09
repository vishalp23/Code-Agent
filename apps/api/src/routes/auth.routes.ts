import { Router, Request, Response } from 'express';
import { supabaseService } from '../services/supabase.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { logger } from '../config/logger';

const router = Router();

// Register new user
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
      return;
    }

    // Register user with Supabase
    const result = await supabaseService.registerUser(email, password, { name });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.user_metadata?.name,
        },
      },
    });
  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Registration failed',
    });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    // Sign in with Supabase
    const result = await supabaseService.signInUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.user_metadata?.name,
        },
        session: {
          access_token: result.session?.access_token,
          refresh_token: result.session?.refresh_token,
          expires_in: result.session?.expires_in,
          expires_at: result.session?.expires_at,
        },
      },
    });
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Invalid credentials',
    });
  }
});

// Refresh access token
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
      return;
    }

    // Refresh session
    const result = await supabaseService.refreshToken(refresh_token);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        session: {
          access_token: result.session?.access_token,
          refresh_token: result.session?.refresh_token,
          expires_in: result.session?.expires_in,
          expires_at: result.session?.expires_at,
        },
      },
    });
  } catch (error: any) {
    logger.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Token refresh failed',
    });
  }
});

// Logout user (requires authentication)
router.post('/logout', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.substring(7); // Remove 'Bearer '

    if (token) {
      await supabaseService.signOutUser(token);
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error: any) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Logout failed',
    });
  }
});

// Get current user (protected route example)
router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error: any) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user',
    });
  }
});

export default router;
