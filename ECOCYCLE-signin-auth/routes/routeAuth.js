const express = require('express');
const router = express.Router();
const controllerAuth = require('../controllers/controllerAuth');
const middlewareAuth = require('../middleware/middlewareAuth');

router.post('/signup', controllerAuth.signup);
router.post('/signin', controllerAuth.signin);
router.get('/me', middlewareAuth, controllerAuth.me);

module.exports = router;
