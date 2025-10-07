const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-schema");
const Driver = require("../models/driver-schema");
const Admin = require("../models/admin-schema");
const { sendTemplateEmail } = require("../config/emailConfig");
const {
  welcomeTemplate,
  verifyEmailTemplate,
  otpTemplate,
} = require("../templates/emailTemplates");
const { v4: uuidv4 } = require("uuid");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

function signToken(user) {
  return jwt.sign(
    { sub: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// ✅ --- SIGNUP (now uses uuidv4 email verification token) ---
exports.signup = async (req, res) => {
  try {
    // Require role during signup so the client explicitly chooses account type
    const {
      name,
      email,
      password,
      role,
      phone,
      licenseNumber,
      vehicleId,
      assignedZone,
      permissions,
      department,
    } = req.body;

    // Basic validation: require name, email, password and role
    if (!name || !email || !password || !role)
      return res
        .status(400)
        .json({ message: "Name, email, password and role are required. Role must be one of: household, driver, admin" });

    // Normalize role and validate allowed values
    const allowedRoles = ['household', 'driver', 'admin'];
    const roleNormalized = String(role).toLowerCase();
    if (!allowedRoles.includes(roleNormalized)) {
      return res.status(400).json({ message: `Invalid role. Allowed: ${allowedRoles.join(', ')}` });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const emailToken = uuidv4();
    let user;

    // Create the appropriate discriminator document using the centralized helper
    // This ensures any new user created anywhere in the code uses the same
    // discriminator logic and prevents duplication.
    const userData = {
      role: roleNormalized,
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      emailToken,
      // include optional role-specific fields (if present)
      licenseNumber,
      vehicleId,
      assignedZone,
      permissions,
      department
    };

    // Validate driver-specific requirement before creation
    if (roleNormalized === 'driver' && !licenseNumber) {
      return res.status(400).json({ message: 'Driver must include licenseNumber' });
    }

    user = await User.createWithRole(userData);

    await user.save();

    // 🔹 Send verification email (now with UUID token)
    await sendTemplateEmail(
      user.email,
      "Verify Your Email - Ecocycle",
      verifyEmailTemplate(user.name, emailToken),
      `Hello ${user.name}, your Ecocycle verification token is ${emailToken}`
    );

    const token = signToken(user);
    res.status(201).json({
      message: "User created. Verification token sent to your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("signup error", err && (err.stack || err));
    // return a helpful message in development, but keep generic in production
    const msg = process.env.NODE_ENV === 'production' ? 'Server error' : (err.message || 'Server error');
    res.status(500).json({ message: msg });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token)
      return res.status(400).json({ message: "Verification token required" });

    const user = await User.findOne({ emailToken: token });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });
    if (user.isVerified)
      return res.status(200).json({ message: "Email already verified" });

    user.isVerified = true;
    user.emailToken = null;
    user.emailVerifiedAt = new Date();
    await user.save();

    // Optional welcome email
    await sendTemplateEmail(
      user.email,
      "Welcome to Ecocycle",
      welcomeTemplate(user.name),
      `Welcome ${user.name}! Your email has been verified successfully.`
    );

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("verifyEmail error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.otp)
      return res.status(404).json({ message: "Invalid OTP or user" });

    if (String(user.otp) !== String(otp))
      return res.status(400).json({ message: "Incorrect OTP" });

    user.otpVerified = true;
    await user.save();

    res.json({ message: "OTP verified. You may now reset your password." });
  } catch (err) {
    console.error("verifyOtp error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ --- SIGNIN (unchanged) ---
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    res.json({
      message: "Authenticated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("signin error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reverted: no overrides here. Original signup and verifyEmail implementations remain above.

// ✅ --- FORGOT PASSWORD (sends OTP) ---
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: "Email required" });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
    user.otp = otp;
    user.otpVerified = false;
    await user.save();

    await sendTemplateEmail(
      user.email,
      "Reset Password - Ecocycle",
      otpTemplate(user.name, otp),
      `Hi ${user.name}, use this OTP to reset your password: ${otp}`
    );

    res.json({ message: "OTP sent to your email for password reset" });
  } catch (err) {
    console.error("forgotPassword error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ --- RESET PASSWORD (requires prior OTP verification) ---
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    // userId param is optional now; old routes may include it but we don't require it
    const { userId } = req.params || {};
    if (!email || !newPassword || !confirmPassword)
      return res
        .status(400)
        .json({ message: "Email, newPassword and confirmPassword, required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpVerified)
      return res.status(403).json({ message: "OTP not verified" });

    if (newPassword.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.passwordHash = passwordHash;

    // Cleanup OTP state
    user.otp = null;
    user.otpVerified = false;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("resetPassword error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ --- ME (unchanged) ---
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("me error", err);
    res.status(500).json({ message: "Server error" });
  }
};
