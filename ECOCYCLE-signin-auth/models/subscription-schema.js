// models/subscription-schema.js
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['one-off', 'weekly', 'bi-weekly', 'monthly'], required: true },
  category: { type: String, default: 'family' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
