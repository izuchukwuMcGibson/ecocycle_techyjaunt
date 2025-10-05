export const welcomeTemplate = (name, authToken) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to EcoCycle</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; padding: 30px;">
    <h2 style="color: #1b5e20; text-align: center;">Welcome to EcoCycle, ${name} 🌿</h2>
    <p style="font-size: 15px; color: #333;">
      We’re excited to have you join the EcoCycle community — a smarter, cleaner way to manage waste. 
      With EcoCycle, you can easily <strong>request waste pickups</strong>, track your collection status, and contribute to a healthier environment.
    </p>

    <p style="font-size: 15px; color: #333;">
      Use the link below to access your dashboard:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://ecocycle.ng/dashboard?auth=${authToken}" 
         style="background-color: #2e7d32; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
         Go to Dashboard
      </a>
    </div>

    <p style="font-size: 14px; color: #777;">
      Together, we can make waste management easy and sustainable.
    </p>

    <p style="font-size: 13px; color: #999;">— The EcoCycle Team</p>
  </div>
</body>
</html>
`;

export const otpTemplate = (name, otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset Code | EcoCycle</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; padding: 30px;">
    <h2 style="color: #1b5e20; text-align: center;">Your Password Reset Code</h2>
    <p style="font-size: 15px; color: #333;">
      Hi ${name},<br><br>
      You requested to reset your EcoCycle password. Use the one-time code below to continue.
    </p>

    <div style="text-align: center; margin: 25px 0;">
      <span style="display: inline-block; background-color: #e8f5e9; padding: 12px 25px; 
                   font-size: 24px; font-weight: bold; color: #2e7d32; border-radius: 8px;">
        ${otp}
      </span>
    </div>

    <p style="font-size: 14px; color: #777;">
      This code expires in 10 minutes. Do not share it with anyone. If you didn’t request a password reset, ignore this email.
    </p>

    <p style="font-size: 13px; color: #999;">— EcoCycle Security Team</p>
  </div>
</body>
</html>
`;

export const verifyEmailTemplate = (name, authToken) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email | EcoCycle</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; padding: 30px;">
    <h2 style="color: #1b5e20; text-align: center;">Verify Your Email Address</h2>
    <p style="font-size: 15px; color: #333;">
      Hello ${name},<br><br>
      Thank you for signing up with EcoCycle! Please verify your email address to activate your account.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://ecocycle.ng/verify-email?token=${authToken}" 
         style="background-color: #2e7d32; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
         Verify Email
      </a>
    </div>

    <p style="font-size: 14px; color: #777;">
      This link will expire in 24 hours. If you didn’t create an account with EcoCycle, please ignore this message.
    </p>

    <p style="font-size: 13px; color: #999;">— The EcoCycle Team</p>
  </div>
</body>
</html>
`;

export const passwordResetTemplate = (name, authToken) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset | EcoCycle</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; padding: 30px;">
    <h2 style="color: #1b5e20; text-align: center;">Password Reset Request</h2>
    <p style="font-size: 15px; color: #333;">
      Hi ${name},<br><br>
      We received a request to reset your password on EcoCycle. Click the button below to create a new one.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://ecocycle.ng/reset-password?token=${authToken}" 
         style="background-color: #2e7d32; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
         Reset Password
      </a>
    </div>

    <p style="font-size: 14px; color: #777;">
      If you didn’t request this, you can safely ignore this email. The link will expire in 30 minutes.
    </p>

    <p style="font-size: 13px; color: #999;">— EcoCycle Security Team</p>
  </div>
</body>
</html>
`;
