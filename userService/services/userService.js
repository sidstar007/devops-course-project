const User = require('../models/userModels');
const jwt = require('jsonwebtoken');
const eventPublisher = require('../events/eventPublisher');
const config = require('../config/config');

// // user-service/src/services/userService.js
// // user-service/src/services/userService.js

// const User = require('../models/userModel');
// const jwt = require('jsonwebtoken');
// const eventPublisher = require('../events/eventPublisher');
// const config = require('../config/config');

exports.registerUser = async (userData) => {
  const { username, email, password } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Create new user
  const newUser = new User({ username, email, password });
  await newUser.save();

  // Emit "User Registered" event
  eventPublisher.publish('user.registered', {
    userId: newUser._id,
    email: newUser.email,
  });

  // Generate JWT with email included
  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  return { token, user: newUser };
};

exports.authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT with email included
  const token = jwt.sign(
    { id: user._id, email: user.email },
    'aryan',
    { expiresIn: '1h' }
  );

  return { token, user };
};

exports.updateUserProfile = async (userId, profileData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.profile = { ...user.profile, ...profileData };
  await user.save();

  // Emit "User Profile Updated" event
  eventPublisher.publish('user.profile.updated', {
    userId: user._id,
    profile: user.profile,
  });

  return user;
};
