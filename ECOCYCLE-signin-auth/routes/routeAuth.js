const express = require('express');
const router = express.Router();
const controllerAuth = require('../controllers/controllerAuth');
const middlewareAuth = require('../middleware/middlewareAuth');

router.post('/signup', controllerAuth.signup);
router.post('/signin', controllerAuth.signin);
router.get('/me', middlewareAuth, controllerAuth.me);
router.post('/verify-otp',controllerAuth.verifyOtp)
router.post('/forgot-password',controllerAuth.forgotPassword)
router.post('/reset-password/:userId',controllerAuth.resetPassword)
router.post('/reset-password', controllerAuth.resetPassword)
router.get('/verify-email/:token',controllerAuth.verifyEmail)


module.exports = router;
