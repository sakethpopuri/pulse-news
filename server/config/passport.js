const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User');

// ─── Local Strategy ────────────────────────────────────────────────────────
passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) return done(null, false, { message: 'No account with that email' });
      if (!user.password) return done(null, false, { message: 'Please sign in with your social account' });
      const ok = await user.comparePassword(password);
      if (!ok) return done(null, false, { message: 'Incorrect password' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ─── Google Strategy ───────────────────────────────────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
  ? 'https://pulse-news-qxmx.onrender.com/api/auth/google/callback'
  : 'http://localhost:5000/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails?.[0]?.value });
        if (user) {
          user.googleId = profile.id;
          user.provider = 'google';
          await user.save();
        } else {
          user = await User.create({
            name:     profile.displayName,
            email:    profile.emails?.[0]?.value || `${profile.id}@google.com`,
            avatar:   profile.photos?.[0]?.value || '',
            googleId: profile.id,
            provider: 'google',
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ─── Facebook Strategy ─────────────────────────────────────────────────────
passport.use(new FacebookStrategy(
  {
    clientID:     process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL:  '/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });
      if (!user) {
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        user = await User.findOne({ email });
        if (user) {
          user.facebookId = profile.id;
          await user.save();
        } else {
          user = await User.create({
            name:       profile.displayName,
            email,
            avatar:     profile.photos?.[0]?.value || '',
            facebookId: profile.id,
            provider:   'facebook',
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ─── Twitter Strategy ──────────────────────────────────────────────────────
passport.use(new TwitterStrategy(
  {
    consumerKey:    process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL:    '/api/auth/twitter/callback',
    includeEmail:   true,
  },
  async (token, tokenSecret, profile, done) => {
    try {
      let user = await User.findOne({ twitterId: profile.id });
      if (!user) {
        const email = profile.emails?.[0]?.value || `${profile.id}@twitter.com`;
        user = await User.findOne({ email });
        if (user) {
          user.twitterId = profile.id;
          await user.save();
        } else {
          user = await User.create({
            name:      profile.displayName,
            email,
            avatar:    profile.photos?.[0]?.value || '',
            twitterId: profile.id,
            provider:  'twitter',
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

module.exports = passport;
