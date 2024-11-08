// user-service/src/controllers/userController.js

const userService=require('../services/userService')

exports.register = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.authenticateUser(email, password);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user; // From auth middleware
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedUser = await userService.updateUserProfile(userId, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
