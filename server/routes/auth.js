const express = require('express');
const passport = require('passport');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect, signToken } = require('../middleware/auth');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// ─── Local Auth ────────────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// ─── Google OAuth ──────────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_URL}/login?error=google_failed` }),
  (req, res) => {
    const token = signToken(req.user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.redirect(`${CLIENT_URL}/oauth/callback?success=true`);
  }
);

// ─── Facebook OAuth ────────────────────────────────────────────────────────
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'], session: false })
);
router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: `${CLIENT_URL}/login?error=facebook_failed` }),
  (req, res) => {
    const token = signToken(req.user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.redirect(`${CLIENT_URL}/oauth/callback?success=true`);
  }
);

// ─── Twitter OAuth ─────────────────────────────────────────────────────────
router.get('/twitter',
  passport.authenticate('twitter', { session: false })
);
router.get('/twitter/callback',
  passport.authenticate('twitter', { session: false, failureRedirect: `${CLIENT_URL}/login?error=twitter_failed` }),
  (req, res) => {
    const token = signToken(req.user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.redirect(`${CLIENT_URL}/oauth/callback?success=true`);
  }
);

module.exports = router;