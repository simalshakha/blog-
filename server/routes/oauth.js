// filepath: server/routes/oauth.js
const express = require('express');
const passport = require('../config/passport');
const router = express.Router();

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/admin' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

module.exports = router;