const express = require('express');
const router = express.Router();
const wrapAsync = require('../utility/wrapAsync');
const passport = require('passport');
const auth = require('../controller/auth');


router.route('/register')
    .get(auth.registerPage)
    .post(wrapAsync(auth.registerUser));

router.route('/login')
    .get(auth.loginPage)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }),
        auth.loginUser);

router.get('/logout', auth.logoutUser);

module.exports = router;