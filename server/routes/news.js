const express = require('express');
const router = express.Router();
const { getNews, getArticle, getStats } = require('../controllers/newsController');
const { optionalAuth } = require('../middleware/auth');

// Public routes (optionalAuth just attaches user if logged in)
router.get('/',       optionalAuth, getNews);
router.get('/stats',  getStats);
router.get('/:id',    optionalAuth, getArticle);

module.exports = router;
