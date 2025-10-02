const User = require('../models/user-schema');

// Admin: List all drivers
exports.listDrivers = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view drivers' });
    }

    const drivers = await User.find({ role: 'driver' }).select('-passwordHash');
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

    const driver = await User.findById(req.userId);
    driver.availabilityStatus = availabilityStatus;
    await driver.save();

    res.json({ message: 'Availability updated', driver });
  } catch (err) {
    console.error('updateAvailability error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
