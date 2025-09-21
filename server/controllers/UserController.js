const bcrypt = require('bcrypt');
const User = require('../models/User');

const UserController = {

  // ✅ Register New User
  registerUser: async (req, res) => {
    const { name, email, username, phone, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        username,
        phone,
        password: hashedPassword
      });

      res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    } catch (err) {
      res.status(500).json({ error: 'Registration failed', details: err.message });
    }
  }, // ✅ Comma added here

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
