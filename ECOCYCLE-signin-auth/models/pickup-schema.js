const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
  household: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // driver assigned
  address: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pickup', PickupSchema);
