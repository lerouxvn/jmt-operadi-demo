const express = require('express');
const passport = require('passport');
const path = require("path");
const User = require("./../auth/user");
const authService = require("./../auth/authService");

const router = express.Router();

router.get('/login', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../views/login.html'));
})

router.get('/unauthorised', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../views/unauthorised.html'));
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/auth/login')
})

router.get('/google',
  passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback',
  passport.authenticate('google', {failureRedirect: '/auth/login'}), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/me', authService.apiGuard, (req, res, next) => {
  res.json({data: req.user})
});

// router.get('/users', authService.apiGuard, utils.parseOptions, user.controller.get);
// router.get('/users/:id', authService.apiGuard, utils.parseOptions, user.controller.getOne);

module.exports = router;
