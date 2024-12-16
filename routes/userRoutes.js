const express = require('express');
const UserProfile = require('../models/UserProfile');

const router = express.Router();

// Create User Profile
router.post('/', async (req, res) => {
  try {
    const userProfile = new UserProfile(req.body);
    const savedProfile = await userProfile.save();
    res.status(201).json(savedProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read User Profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await UserProfile.find();
    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read Single Profile by ID
router.get('/:id', async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update User Profile
router.put('/:id', async (req, res) => {
  try {
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProfile)
      return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(updatedProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete User Profile
router.delete('/:id', async (req, res) => {
  try {
    const deletedProfile = await UserProfile.findByIdAndDelete(req.params.id);
    if (!deletedProfile)
      return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
