import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

class SupabaseService {
  private static instance: SupabaseService;
  public client: SupabaseClient;

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials in environment variables');
    }

    // Create admin client with service role key
    this.client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    logger.info('✅ Supabase client initialized');
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // Register new user
  async registerUser(email: string, password: string, metadata?: { name?: string }) {
    try {
      const { data, error } = await this.client.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm for development
        user_metadata: metadata,
      });

      if (error) {
        logger.error('Supabase registration error:', error);
        throw error;
      }

      logger.info(`User registered: ${email}`);
      return data;
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  // Sign in user
  async signInUser(email: string, password: string) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error('Supabase login error:', error);
        throw error;
      }

      logger.info(`User logged in: ${email}`);
      return data;
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  // Verify JWT token
  async verifyToken(token: string) {
    try {
      const { data, error } = await this.client.auth.getUser(token);

      if (error) {
        logger.error('Token verification error:', error);
        throw error;
      }

      return data.user;
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string) {
    try {
      const { data, error } = await this.client.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        logger.error('Token refresh error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  // Sign out user
  async signOutUser(token: string) {
    try {
      await this.client.auth.admin.signOut(token);
      logger.info('User signed out');
    } catch (error) {
      logger.error('Sign out error:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId: string) {
    try {
      const { data, error } = await this.client.auth.admin.getUserById(userId);

      if (error) {
        logger.error('Get user error:', error);
        throw error;
      }

      return data.user;
    } catch (error) {
      logger.error('Get user failed:', error);
      throw error;
    }
  }

  // Update user metadata
  async updateUser(userId: string, updates: { email?: string; password?: string; user_metadata?: any }) {
    try {
      const { data, error } = await this.client.auth.admin.updateUserById(userId, updates);

      if (error) {
        logger.error('Update user error:', error);
        throw error;
      }

      logger.info(`User updated: ${userId}`);
      return data.user;
    } catch (error) {
      logger.error('Update user failed:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId: string) {
    try {
      const { error } = await this.client.auth.admin.deleteUser(userId);

      if (error) {
        logger.error('Delete user error:', error);
        throw error;
      }

      logger.info(`User deleted: ${userId}`);
    } catch (error) {
      logger.error('Delete user failed:', error);
      throw error;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string) {
    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email);

      if (error) {
        logger.error('Password reset error:', error);
        throw error;
      }

      logger.info(`Password reset email sent to: ${email}`);
    } catch (error) {
      logger.error('Password reset failed:', error);
      throw error;
    }
  }
}

export const supabaseService = SupabaseService.getInstance();
