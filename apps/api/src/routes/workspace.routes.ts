import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get workspaces - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create workspace - to be implemented' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get workspace ${req.params.id} - to be implemented` });
});

export default router;
