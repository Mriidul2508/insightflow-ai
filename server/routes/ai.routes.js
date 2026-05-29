const express = require('express');
const router = express.Router();
const { generateReadme } = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/auth');

router.post('/generate-readme', optionalAuth, generateReadme);

module.exports = router;
