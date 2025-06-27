const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Report = require('../models/Report');
const mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Test route to verify MongoDB connection and create a user
router.get('/test-connection', async (req, res) => {
  try {
    // Test MongoDB connection
    const dbState = mongoose.connection.readyState;
    console.log('MongoDB connection state:', dbState);
    
    // Try to create a test user
    const testUser = new User({
      firebaseUid: 'TXBP8eZWPtcg37MZHSyinE8efkr2',
      email: 'heshamelmogy14@gmail.com',
      firstName: '',
      lastName: '',
      gender: 'prefer-not-to-say'
    });
    
    await testUser.save();
    console.log('Test user created successfully:', testUser);
    
    res.json({
      message: 'MongoDB connection successful',
      connectionState: dbState,
      user: testUser
    });
  } catch (err) {
    console.error('Error in test connection:', err);
    res.status(500).json({
      error: 'MongoDB connection test failed',
      details: err.message,
      stack: err.stack
    });
  }
});

// Get user by Firebase UID
router.get('/firebase/:firebaseUid', async (req, res) => {
  try {
    console.log('Fetching user with Firebase UID:', req.params.firebaseUid);
    let user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      // Auto-create user with default values
      const newUserData = {
        firebaseUid: req.params.firebaseUid,
        email: req.query.email || `${req.params.firebaseUid}@autocreated.local`,
        firstName: req.query.firstName || '',
        lastName: req.query.lastName || '',
        gender: 'prefer-not-to-say' // Always use a valid enum value
      };
      console.log('Attempting to auto-create user with:', newUserData);
      try {
        user = new User(newUserData);
        await user.save();
        console.log('Auto-created user:', user);
      } catch (creationErr) {
        console.error('Error auto-creating user:', creationErr);
        return res.status(500).json({ error: 'Failed to auto-create user', details: creationErr.message });
      }
    }
    console.log('Found user:', user);
    res.json(user);
  } catch (err) {
    console.error('Error in /firebase/:firebaseUid route:', err);
    res.status(500).json({ error: 'Failed to fetch user data', details: err.message });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    console.log('Getting user by ID:', req.params.userId);
    
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      console.log('Invalid MongoDB ID format');
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(req.params.userId)
      .select('-password');

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user._id);
    res.json(user);
  } catch (error) {
    console.error('Error in get user by ID:', error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const { firstName, lastName, gender } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { firstName, lastName, gender },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user data' });
  }
});

// Create user profile (called after Firebase auth)
router.post('/profile', async (req, res) => {
  try {
    const { firebaseUid, email, firstName, lastName, gender, phone, phoneVerified } = req.body;
    console.log('Creating user profile with data:', { firebaseUid, email, firstName, lastName, gender, phone, phoneVerified });
    
    // Check if user already exists
    let user = await User.findOne({ firebaseUid });
    if (user) {
      console.log('User already exists:', user);
      return res.json(user);
    }

    // Create new user with valid gender value
    user = new User({
      firebaseUid,
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      gender: gender || 'prefer-not-to-say',
      phone: phone || '',
      phoneVerified: !!phoneVerified
    });
    await user.save();
    console.log('Created new user:', user);
    
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user profile' });
  }
});

// Test route to create a user
router.post('/test-create', async (req, res) => {
  try {
    const testUser = new User({
      firebaseUid: 'TXBP8eZWPtcg37MZHSyinE8efkr2',
      email: 'heshamelmogy14@gmail.com',
      firstName: '',
      lastName: '',
      gender: 'prefer-not-to-say'
    });
    
    await testUser.save();
    console.log('Test user created:', testUser);
    res.json(testUser);
  } catch (err) {
    console.error('Error creating test user:', err);
    res.status(500).json({ error: 'Failed to create test user', details: err.message });
  }
});

// Debug endpoint to check if user exists
router.get('/debug/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Debug: Checking if user exists with ID:', userId);
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ 
        exists: false, 
        error: 'Invalid MongoDB ID format',
        userId: userId 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ 
        exists: false, 
        error: 'User not found',
        userId: userId 
      });
    }

    return res.json({ 
      exists: true, 
      user: {
        _id: user._id,
        email: user.email,
        firebaseUid: user.firebaseUid,
        firstName: user.firstName,
        lastName: user.lastName
      },
      userId: userId 
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ 
      exists: false, 
      error: 'Server error', 
      details: error.message,
      userId: req.params.userId 
    });
  }
});

// Delete user account
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Attempting to delete user with ID:', userId);

    // Find the user first to get their information
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('Found user:', { _id: user._id, email: user.email, firebaseUid: user.firebaseUid });

    // Delete user's posts
    console.log('Deleting user posts...');
    const postsResult = await Post.deleteMany({ user: userId });
    console.log('Deleted posts count:', postsResult.deletedCount);

    // Delete user's chats
    console.log('Deleting user chats...');
    const chatsResult = await Chat.deleteMany({
      users: userId
    });
    console.log('Deleted chats count:', chatsResult.deletedCount);

    // Delete user's messages
    console.log('Deleting user messages...');
    const messagesResult = await Message.deleteMany({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    });
    console.log('Deleted messages count:', messagesResult.deletedCount);

    // Delete user's reports
    console.log('Deleting user reports...');
    const reportsResult = await Report.deleteMany({
      reporter: userId
    });
    console.log('Deleted reports count:', reportsResult.deletedCount);

    // Finally delete the user
    console.log('Deleting user document...');
    const deleteResult = await User.findByIdAndDelete(userId);
    if (!deleteResult) {
      console.log('Failed to delete user document');
      return res.status(500).json({ error: 'Failed to delete user' });
    }
    console.log('User deleted successfully');

    res.json({ 
      message: 'User and all associated data deleted successfully',
      deletedData: {
        posts: postsResult.deletedCount,
        chats: chatsResult.deletedCount,
        messages: messagesResult.deletedCount,
        reports: reportsResult.deletedCount
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

module.exports = router;
