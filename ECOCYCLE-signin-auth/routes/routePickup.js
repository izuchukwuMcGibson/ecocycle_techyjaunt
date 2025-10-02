const express = require('express');
const router = express.Router();
const controllerPickup = require('../controllers/controllerPickup');
const middlewareAuth = require('../middleware/middlewareAuth');

// Household
router.post('/', middlewareAuth, controllerPickup.createPickup);

// Admin
router.post('/assign', middlewareAuth, controllerPickup.assignDriver);

// Driver
router.post('/status', middlewareAuth, controllerPickup.updateStatus);

// All (with filtering by role)
router.get('/', middlewareAuth, controllerPickup.listPickups);

module.exports = router;
