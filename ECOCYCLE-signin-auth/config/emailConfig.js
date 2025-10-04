const nodemailer = require('nodemailer');

// Basic plain-text email sender
exports.sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `EcoCycle <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('EcoCycle plain email sent successfully');
  } catch (error) {
    console.log('Error sending plain email:', error);
  }
};

// Template-based email sender (HTML + fallback text)
exports.sendTemplateEmail = async (to, subject, htmlContent, textContent = '') => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `EcoCycle <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: textContent || 'EcoCycle Notification',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`EcoCycle template email sent to ${to}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending template email:', error);
    return { success: false, message: error.message };
  }
};
