const express = require('express');
const router = express.Router({ mergeParams: true });
const db=require('../connection')
const User = require('../models/users');

const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
const passport = require('passport');
const users = require('../controllers/users');



router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;


  // router.get('/logout', function(req, res, next) {
  //   req.logout(function(err) {
  //     if (err) { return next(err); }
  //     res.redirect('/campgrounds');
  //   });
  // });





