const mongoose = require('mongoose');
const User = require('./user-schema');

const AdminSchema = new mongoose.Schema({
  permissions: [{ type: String }],
  department: { type: String },
  managedDrivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = User.discriminator('admin', AdminSchema);
