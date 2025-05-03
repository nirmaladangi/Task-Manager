const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all tasks
router.get('/', auth, (req, res) => {
  db.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Add task
router.post('/', auth, (req, res) => {
  const { title, description, priority } = req.body;
  db.query(
    'INSERT INTO tasks (title, description, priority, user_id) VALUES (?, ?, ?, ?)',
    [title, description, priority, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Task added' });
    }
  );
});

// Update task status
router.put('/:id', auth, (req, res) => {
  const { status } = req.body;
  db.query('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?', [status, req.params.id, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Task updated' });
  });
});

// Delete task
router.delete('/:id', auth, (req, res) => {
  db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Task deleted' });
  });
});

module.exports = router;
