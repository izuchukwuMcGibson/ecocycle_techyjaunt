const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  household: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['weekly', 'monthly'], required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
