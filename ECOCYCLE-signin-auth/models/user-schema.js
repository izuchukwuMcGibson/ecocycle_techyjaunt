const mongoose = require('mongoose');

const options = { discriminatorKey: 'role', collection: 'users' };

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date }
}, options);

module.exports = mongoose.model('User', UserSchema);
