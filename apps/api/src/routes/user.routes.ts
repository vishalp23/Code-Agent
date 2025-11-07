import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/me', (req, res) => {
  res.json({ message: 'Get current user - to be implemented' });
});

router.patch('/me', (req, res) => {
  res.json({ message: 'Update current user - to be implemented' });
});

export default router;
