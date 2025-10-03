const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { 
    type: String, 
    enum: ['one-off', 'weekly', 'bi-weekly', 'monthly'], 
    required: true 
  },
  category: { type: String, enum: ['family', 'business'], default: 'family' }, // optional PRD field
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
