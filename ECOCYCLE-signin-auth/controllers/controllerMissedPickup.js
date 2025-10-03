const MissedPickup = require('../models/missedPickup-schema');

// Report a missed pickup (Household)
exports.reportMissed = async (req, res) => {
  try {
    if (req.userRole !== 'household') {
      return res.status(403).json({ message: 'Only households can report missed pickups' });
    }

    const { pickupDate, description } = req.body;
    if (!pickupDate || !description) {
      return res.status(400).json({ message: 'pickupDate and description required' });
    }

    const report = new MissedPickup({ user: req.userId, pickupDate, description });
    await report.save();

    res.status(201).json({ message: 'Missed pickup reported', report });
  } catch (err) {
    console.error('reportMissed error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin view all reports
exports.listReports = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view reports' });
    }

    const reports = await MissedPickup.find().populate('user', 'name email');
    res.json({ reports });
  } catch (err) {
    console.error('listReports error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin resolve report
exports.resolveReport = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admins can resolve reports' });
    }

    const { reportId } = req.body;
    const report = await MissedPickup.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = 'resolved';
    await report.save();

    res.json({ message: 'Report resolved', report });
  } catch (err) {
    console.error('resolveReport error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
