const express = require('express');
const router = express.Router();
const driverController = require('../controllers/controllerDriver');

router.post('/add', driverController.addDriver);
router.get('/all', driverController.getAllDrivers);

module.exports = router;

