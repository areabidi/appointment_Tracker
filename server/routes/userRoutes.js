

/*We'll create a User route that allows us to:
✅ Register a new user (POST /users/register)
✅ Login a user (POST /users/login)
✅ (Optional) Get all users (GET /users) */



// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Import controller functions (we'll create these next)
const UserController = require('../controllers/UserController');

// Route to register a new user
router.post('/register', UserController.registerUser);

// Route to login a user
router.post('/login', UserController.loginUser);

// Optional: Get all users
router.get('/', UserController.getAllUsers);

module.exports = router;
