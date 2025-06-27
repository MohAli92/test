const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationCode, verifyCode } = require('../utils/whatsapp');

// Sign up endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, gender, phone, phoneVerified } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'This email is already registered. Please sign in instead.' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      gender: gender || 'prefer-not-to-say',
      phone: phone || '',
      phoneVerified: !!phoneVerified
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

// Sign in endpoint
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'No account found with this email. Please sign up first.' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Incorrect password. Please try again.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Sign in successful',
      user: userResponse,
      token
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Placeholder for phone/Google auth (to be replaced with real logic)
router.post('/register', async (req, res) => {
  const { phone, googleId, name, email, avatar } = req.body;
  try {
    let user = await User.findOne({ $or: [{ phone }, { googleId }] });
    if (!user) {
      user = new User({ phone, googleId, name, email, avatar });
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: إرسال كود التحقق على الواتساب
router.post('/send-whatsapp-code', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });
  try {
    await sendVerificationCode(phone);
    res.json({ success: true, message: 'Verification code sent via WhatsApp' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send WhatsApp code', details: err.message });
  }
});

// Endpoint: تحقق من كود الواتساب
router.post('/verify-whatsapp-code', (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: 'Phone and code are required' });
  const valid = verifyCode(phone, code);
  if (!valid) return res.status(400).json({ error: 'Invalid or expired code' });
  res.json({ success: true });
});

module.exports = router;