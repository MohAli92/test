const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Report = require('../models/Report');
const User = require('../models/User');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const mongoose = require('mongoose');

// Upload an image and save locally
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    // Return the local URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image. Please try again.' });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { user, photo, ingredients, allergies, city, address, time, description } = req.body;

    // Validate required fields
    if (!user || !photo || !ingredients || !city || !address || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const post = new Post({
      user,
      photo,
      ingredients,
      allergies: allergies || [],
      city,
      address,
      time: new Date(time),
      description: description || '',
      reserved: false
    });

    await post.save();
    const populatedPost = await Post.findById(post._id).populate('user', 'firstName lastName avatar firebaseUid');
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error('Post creation error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to create post. Please try again.' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'firstName lastName avatar firebaseUid');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reserve a post
router.patch('/:id/reserve', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { reserved: true },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search posts by meal or city
router.get('/search', async (req, res) => {
  try {
    const { q, city } = req.query;
    let filter = {};
    if (q) {
      filter.ingredients = { $regex: q, $options: 'i' };
    }
    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }
    const posts = await Post.find(filter).populate('user', 'firstName lastName avatar firebaseUid');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Report a post
router.post('/:id/report', async (req, res) => {
  try {
    const { reporter, reason } = req.body;
    const report = new Report({
      post: req.params.id,
      reporter,
      reason
    });
    await report.save();
    res.json({ message: 'Report submitted', report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a post
router.patch('/:id', async (req, res) => {
  try {
    const updateFields = [
      'description', 'ingredients', 'allergies', 'city', 'address', 'time', 'photo'
    ];
    const updates = {};
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Try both ObjectId and string
    let post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!post) {
      post = await Post.findOneAndUpdate({ _id: req.params.id }, updates, { new: true });
    }
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;