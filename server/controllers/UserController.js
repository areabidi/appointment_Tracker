const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const User = require('../models/User');

const UserController = {

  // ✅ Register New User
  registerUser: async (req, res) => {
    const { fullName, email, username, phone, password } = req.body;

    try {
      // Check if a user with the same email or username exists
      const existingUser = await User.findOne({
        where: {
          [Sequelize.Op.or]: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email or username already in use' });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({
        fullName,
        email,
        username,
        phone,
        password: hashedPassword
      });

      res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    } catch (err) {
      res.status(500).json({ error: 'Registration failed', details: err.message });
    }
  },

  // 🔐 Login Existing User
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      res.json({ message: 'Login successful', userId: user.id });
    } catch (err) {
      res.status(500).json({ error: 'Login failed', details: err.message });
    }
  },

  // 👀 Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get users' });
    }
  }
};

module.exports = UserController;
