const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user-schema');
const Driver = require('../models/driver-schema');
const Admin = require('../models/admin-schema');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

function signToken(user) {
  return jwt.sign({ sub: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role = 'household', phone, licenseNumber, vehicleId, assignedZone, permissions, department } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    let user;

    if (role === 'driver') {
      if (!licenseNumber) return res.status(400).json({ message: 'Driver must include licenseNumber' });
      user = new Driver({ name, email: email.toLowerCase(), passwordHash, phone, licenseNumber, vehicleId, assignedZone });
    } else if (role === 'admin') {
      user = new Admin({ name, email: email.toLowerCase(), passwordHash, phone, permissions, department });
    } else {
      user = new User({ name, email: email.toLowerCase(), passwordHash, phone });
    }

    await user.save();
    const token = signToken(user);
    res.status(201).json({ message: 'User created', user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('signup error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    res.json({ message: 'Authenticated', user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('signin error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('me error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
