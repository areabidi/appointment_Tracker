/*require('dotenv').config();          // Load environment variables
const express = require('express');  // Import Express
const app = express();               // Initialize Express app
const cors = require('cors');        // CORS middleware
const sequelize = require('./config/database'); // Sequelize instance

// ✅ Import the model BEFORE calling sync()
const User = require('./models/User'); // <-- This makes sure the Users table is created

// Sync all models (create tables if they don't exist)
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');

    // Allow cross-origin requests from frontend URL
    app.use(cors({
      origin: 'http://localhost:5173',  // <-- Replace with your frontend URL and port
      credentials: true                 // Allows cookies and credentials if needed
    }));

    app.use(express.json());             // Parse JSON bodies in requests

    const userRoutes = require('./routes/userRoutes');
    app.use('/users', userRoutes);      // Base path

    // Basic test route
    app.get('/', (req, res) => {
      res.send('Hello from Appointment Tracker backend!');
    });

    // Start server inside the .then to ensure DB syncs first
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }) // <-- close the .then() block here
  .catch((error) => {
    console.error('Unable to create tables:', error);
  });
*/

require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const app = express();

// ✅ Sequelize instance
const sequelize = require('./config/database');

// ✅ Import the model BEFORE calling sync()
const User = require('./models/User'); // <-- This makes sure the Users table is created

// ✅ Sync all models (create tables if they don't exist)
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');

    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true
    }));

    app.use(express.json());

    const userRoutes = require('./routes/userRoutes');
    app.use('/users', userRoutes);

    // Basic test route
    app.get('/', (req, res) => {
      res.send('Hello from Appointment Tracker backend!');
    });

    // ✅ Start server after DB is ready
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to create tables:', error);
  });
