const express = require('express');
const router = express.Router();
const { getHistory, getProject, deleteProject } = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getHistory);
router.get('/:id', getProject);
router.delete('/:id', deleteProject);

module.exports = router;
