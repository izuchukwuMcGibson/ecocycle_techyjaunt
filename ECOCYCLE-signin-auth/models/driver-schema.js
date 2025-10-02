const mongoose = require('mongoose');
const User = require('./user-schema');

const DriverSchema = new mongoose.Schema({
  licenseNumber: { type: String, required: true },
  vehicleId: { type: String },
  assignedZone: { type: String },
  availabilityStatus: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
  totalPickups: { type: Number, default: 0 }
});

module.exports = User.discriminator('driver', DriverSchema);
