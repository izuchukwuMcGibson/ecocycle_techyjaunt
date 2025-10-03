const Pickup = require('../models/pickup-schema');
const User = require('../models/user-schema');

// Household creates a pickup request
exports.createPickup = async (req, res) => {
  try {
    if (req.userRole !== 'household') {
      return res.status(403).json({ message: 'Only households can request pickups' });
    }

    const { address, scheduledAt } = req.body;
    if (!address || !scheduledAt) return res.status(400).json({ message: 'Address and scheduledAt required' });

    const pickup = new Pickup({
      household: req.userId,
      address,
      scheduledAt
    });

    await pickup.save();
    res.status(201).json({ message: 'Pickup request created', pickup });
  } catch (err) {
    console.error('createPickup error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin assigns driver
exports.assignDriver = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admins can assign drivers' });
    }

    const { pickupId, driverId } = req.body;
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(400).json({ message: 'Invalid driver' });
    }

    pickup.driver = driver._id;
    pickup.status = 'assigned';
    await pickup.save();

    res.json({ message: 'Driver assigned', pickup });
  } catch (err) {
    console.error('assignDriver error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Driver updates status
exports.updateStatus = async (req, res) => {
  try {
    if (req.userRole !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can update pickup status' });
    }

    const { pickupId, status } = req.body;
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });

    if (!['in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    pickup.status = status;
    await pickup.save();

    res.json({ message: 'Pickup status updated', pickup });
  } catch (err) {
    console.error('updateStatus error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Household/Admin fetch pickups
exports.listPickups = async (req, res) => {
  try {
    let query = {};
    if (req.userRole === 'household') query.household = req.userId;
    if (req.userRole === 'driver') query.driver = req.userId;

    const pickups = await Pickup.find(query).populate('household driver', 'name email role');
    res.json({ pickups });
  } catch (err) {
    console.error('listPickups error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Driver accepts/rejects pickup
exports.driverDecision = async (req, res) => {
  try {
    if (req.userRole !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can accept/reject pickups' });
    }

    const { pickupId, decision } = req.body; // decision = "accept" | "reject"
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });

    if (pickup.status !== 'assigned') {
      return res.status(400).json({ message: 'Pickup not available for decision' });
    }

    if (decision === 'accept') {
      pickup.status = 'in-progress';
      pickup.driver = req.userId;
    } else if (decision === 'reject') {
      pickup.status = 'pending';
      pickup.driver = null;
    } else {
      return res.status(400).json({ message: 'Decision must be accept or reject' });
    }

    await pickup.save();
    res.json({ message: `Driver ${decision}ed pickup`, pickup });
  } catch (err) {
    console.error('driverDecision error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
