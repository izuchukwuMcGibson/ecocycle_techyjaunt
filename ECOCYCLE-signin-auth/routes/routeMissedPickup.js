const express = require('express');
const router = express.Router();
const controllerMissedPickup = require('../controllers/controllerMissedPickup');
const middlewareAuth = require('../middleware/middlewareAuth');

// Household
router.post('/', middlewareAuth, controllerMissedPickup.reportMissed);

// Admin
router.get('/', middlewareAuth, controllerMissedPickup.listReports);
router.post('/resolve', middlewareAuth, controllerMissedPickup.resolveReport);

module.exports = router;
