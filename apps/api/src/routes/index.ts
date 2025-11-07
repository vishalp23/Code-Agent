import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import workspaceRoutes from './workspace.routes';
import userRoutes from './user.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/users', userRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Enterprise Agentic IDE API',
    version: process.env.API_VERSION || 'v1',
    endpoints: {
      auth: '/auth',
      tasks: '/tasks',
      workspaces: '/workspaces',
      users: '/users'
    }
  });
});

export default router;
