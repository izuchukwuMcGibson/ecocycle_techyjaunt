// models/subscription-schema.js
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },

  // This is the magic key:
  type: {
    type: String,
    enum: ['one-off', 'weekly', 'monthly', 'yearly', 'custom'],
    default: 'one-off'
  },

  // For recurring/custom stuff
  frequency: { type: String }, // e.g. "every 2 weeks" or cron pattern
  endDate: { type: Date } // if recurring ends at some date
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
