const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
  },
  skills: {
    type: [String], // Array of strings
    default: [],
  },
  profilePicture: {
    type: String,
    required: true,
    match: [
      /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i,
      'Please provide a valid image URL.',
    ],
  },
  bio: {
    type: String,
    default: '',
  },
  portfolio: {
    type: String,
    match: [
      /^(https?:\/\/.*)/i,
      'Please provide a valid URL for the portfolio.',
    ],
  },
});

module.exports = mongoose.model('User', userProfileSchema);
