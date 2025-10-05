const mongoose = require('mongoose');

const options = { discriminatorKey: 'role', collection: 'users' };

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  // role is the discriminator key used by Mongoose to create subclassed models
  // Make it explicit in the schema so validation and form prompts can use it.
  role: { type: String, enum: ['household', 'driver', 'admin'], default: 'household', required: true },

  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  otpVerified:{type: Boolean,default: false},
  isVerified: {type: Boolean,default: false},
  otp:{ type: Number},
  emailToken:{ type: String},
  passwordHash: { type: String, required: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date }
}, options);

// Normalize role value to lowercase and ensure it's one of allowed values
UserSchema.pre('validate', function(next) {
  if (this.role && typeof this.role === 'string') {
    this.role = this.role.toLowerCase();
  }
  // allowed values provided by enum; Mongoose will validate and throw if invalid
  next();
});

module.exports = mongoose.model('User', UserSchema);

// Static helper to create the correct discriminator document based on role.
// Usage: User.createWithRole({ role: 'driver', name: 'Bob', ... })
// This function ensures the appropriate discriminator model (driver/admin)
// is used so schema-specific fields are validated.
mongoose.model('User').schema.statics.createWithRole = async function(data) {
  const role = (data.role || 'household').toLowerCase();
  // Ensure discriminator models are registered by requiring their files
  try {
    require('./driver-schema');
  } catch (err) { /* ignore if already loaded */ }
  try {
    require('./admin-schema');
  } catch (err) { /* ignore if already loaded */ }

  if (role === 'driver') {
    const Driver = mongoose.model('driver');
    return new Driver(data);
  }
  if (role === 'admin') {
    const Admin = mongoose.model('admin');
    return new Admin(data);
  }
  // default household user
  return new (mongoose.model('User'))(data);
};
