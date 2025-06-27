const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages for a user (both sent and received)
router.get('/:userId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.params.userId },
        { receiver: req.params.userId }
      ]
    })
    .populate('sender', 'firstName lastName avatar')
    .populate('receiver', 'firstName lastName avatar')
    .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unread message count
router.get('/unread/:userId', async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.params.userId,
      read: false
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark messages as read
router.patch('/read/:userId', async (req, res) => {
  try {
    await Message.updateMany(
      {
        receiver: req.params.userId,
        read: false
      },
      {
        read: true
      }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a new message
router.post('/', async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;
    const message = new Message({
      sender,
      receiver,
      text,
      read: false
    });
    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName avatar')
      .populate('receiver', 'firstName lastName avatar');
    
    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 