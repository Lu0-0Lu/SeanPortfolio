const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  message: { error: 'Too many messages sent from this IP, please try again later.' }
});

const sanitize = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};

// Configure Nodemailer with your Gmail and an App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'reyesseanbrandon@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD // Never use your raw Gmail password; use a Google App Password
  }
});

router.post('/', contactLimiter, async (req, res) => {
  try {
    const name = sanitize(req.body.name);
    const email = sanitize(req.body.email);
    const message = sanitize(req.body.message);

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Setup email options
    const mailOptions = {
      from: email,
      to: 'reyesseanbrandon@gmail.com',
      subject: `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Message sent to your inbox successfully!' });
  } catch (err) {
    console.error('Nodemailer error:', err);
    return res.status(500).json({ error: 'Failed to send email. Check server configuration.' });
  }
});

module.exports = router;