import { Router } from 'express';
// Controllers will be implemented in Day 3-4
// import { register, login, refresh, logout } from '../controllers/auth.controller';

const router = Router();

// Placeholder routes - will implement controllers next
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint - to be implemented' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - to be implemented' });
});

router.post('/refresh', (req, res) => {
  res.json({ message: 'Refresh token endpoint - to be implemented' });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint - to be implemented' });
});

export default router;
