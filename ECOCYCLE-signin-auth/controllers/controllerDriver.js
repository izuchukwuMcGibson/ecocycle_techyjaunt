const bcrypt = require('bcryptjs');
const User = require('../models/user-schema');
const Driver = require('../models/driver-schema');

// List all drivers
exports.listDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-passwordHash');
    res.json({ drivers });
  } catch (err) {
    console.error('listDrivers error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Driver: Update availability
exports.updateAvailability = async (req, res) => {
  try {
    if (req.userRole !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can update availability' });
    }

    const { availabilityStatus } = req.body;
    if (!['available', 'busy', 'offline'].includes(availabilityStatus)) {
      return res.status(400).json({ message: 'Invalid availabilityStatus' });
    }

    const driver = await Driver.findById(req.userId);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    driver.availabilityStatus = availabilityStatus;
    await driver.save();

    res.json({ message: 'Availability updated', driver });
  } catch (err) {
    console.error('updateAvailability error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a driver (no admin restriction)
exports.addDriver = async (req, res) => {
  try {
    const { name, email, password, phone, licenseNumber, vehicleId, assignedZone } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Use the centralized factory/static to create the correct discriminator
    const driverDoc = await User.createWithRole({
      role: 'driver',
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      licenseNumber,
      vehicleId,
      assignedZone
    });

    await driverDoc.save();
    res.status(201).json(driverDoc);
  } catch (err) {
    console.error('addDriver error', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-passwordHash');
    res.json(drivers);
  } catch (err) {
    console.error('getAllDrivers error', err);
    res.status(500).json({ error: err.message });
  }
};
