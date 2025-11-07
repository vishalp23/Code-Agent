import { Router } from 'express';

const router = Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ message: 'Get tasks - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create task - to be implemented' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get task ${req.params.id} - to be implemented` });
});

router.patch('/:id', (req, res) => {
  res.json({ message: `Update task ${req.params.id} - to be implemented` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete task ${req.params.id} - to be implemented` });
});

export default router;
