const express = require('express');
const router = express.Router();
const controllerSubscription = require('../controllers/controllerSubscription');
const middlewareAuth = require('../middleware/middlewareAuth');

// Household
router.post('/', middlewareAuth, controllerSubscription.createSubscription);

// Household/Admin
router.get('/', middlewareAuth, controllerSubscription.getSubscriptions);

// Admin
router.post('/cancel', middlewareAuth, controllerSubscription.cancelSubscription);

module.exports = router;
