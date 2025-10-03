const Subscription = require('../models/subscription-schema');

// Household subscribes
exports.createSubscription = async (req, res) => {
  try {
    if (req.userRole !== 'household') {
      return res.status(403).json({ message: 'Only households can subscribe' });
    }

    const { plan, category } = req.body;
    if (!['one-off', 'weekly', 'bi-weekly', 'monthly'].includes(plan)) {
      return res.status(400).json({ message: 'Plan must be one-off, weekly, bi-weekly or monthly' });
    }

    // calculate duration
    let duration = 0;
    if (plan === 'one-off') duration = 1;
    if (plan === 'weekly') duration = 7;
    if (plan === 'bi-weekly') duration = 14;
    if (plan === 'monthly') duration = 30;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + duration);

    const subscription = new Subscription({
      user: req.userId,
      plan,
      category: category || 'family',
      startDate,
      endDate
    });

    await subscription.save();
    res.status(201).json({ message: 'Subscription created', subscription });
  } catch (err) {
    console.error('createSubscription error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Household/Admin: View subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    let query = {};
    if (req.userRole === 'household') query.user = req.userId;

    const subs = await Subscription.find(query).populate('user', 'name email');
    res.json({ subscriptions: subs });
  } catch (err) {
    console.error('getSubscriptions error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Cancel a subscription
exports.cancelSubscription = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admins can cancel subscriptions' });
    }

    const { subscriptionId } = req.body;
    const sub = await Subscription.findById(subscriptionId);
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });

    sub.active = false;
    await sub.save();

    res.json({ message: 'Subscription cancelled', subscription: sub });
  } catch (err) {
    console.error('cancelSubscription error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
