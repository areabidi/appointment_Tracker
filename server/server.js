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


require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const app = express();

// ✅ Sequelize instance
const sequelize = require('./config/database');

// ✅ Import the model BEFORE calling sync()
const User = require('./models/User'); // <-- This makes sure the Users table is created

// ✅ Sync all models (create tables if they don't exist)
//sequelize.sync()
sequelize.sync({ force: true })

  .then(() => {
    console.log('Database & tables created!');

    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true
    }));

    app.use(express.json());

    const userRoutes = require('./routes/userRoutes');
    app.use('/users', userRoutes);

    const patientRoutes = require('./routes/patientRoutes'); // make sure this exists
    app.use('/api/patients', patientRoutes);

    // Basic test route
    app.get('/', (req, res) => {
      res.send('Hello from Appointment Tracker backend!');
    });

    // ✅ Start server after DB is ready
    //const PORT = process.env.PORT || 3000;
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to create tables:', error);
  });
*/



////
/*
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const app = express();

const sequelize = require('./config/database'); // Sequelize instance (your database connection)
const User = require('./models/User');           // Make sure your User model is imported
const Patient = require('./models/Patient');     // Import Patient model if you have one

const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes'); // Make sure this file exists!

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Change to your frontend URL
  credentials: true,
}));
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello from Appointment Tracker backend!');
});

// Sync database and start server
sequelize.sync({ alter: true })  // alter: true updates tables without dropping them; use force: true to drop tables (dev only)
  .then(() => {
    console.log('✅ Database connected and synced');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database sync error:', err);
  });
*/

require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const app = express();

const sequelize = require('./config/database'); // Sequelize instance
const User = require('./models/User');          // Sequelize model for User
const Patient = require('./models/Patient');    // Optional: only if you're using it

const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');


// === Middleware ===
app.use(cors({
  origin: 'http://localhost:5173',  // Change to match your frontend
  credentials: true,
}));
app.use(express.json()); // To parse JSON request bodies

// === Routes ===
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);


// === Test Route ===
app.get('/', (req, res) => {
  res.send('Hello from Appointment Tracker backend!');
});

// === Backup Logic ===
const backupUsers = async () => {
  try {
    // 1. Create backup table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Users_backup (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        email TEXT,
        phone TEXT,
        role TEXT,
        createdAt DATETIME,
        updatedAt DATETIME,
        fullName TEXT
      )
    `);

    // 2. Insert from Users into backup, skipping ID to auto-generate
    await sequelize.query(`
      INSERT INTO Users_backup (username, password, email, phone, role, createdAt, updatedAt, fullName)
      SELECT username, password, email, phone, role, createdAt, updatedAt, fullName FROM Users
    `);

    console.log('✅ Users backed up to Users_backup table');
  } catch (error) {
    // Don't crash on duplicate insert — just warn
    if (error.message.includes('UNIQUE constraint failed')) {
      console.warn('⚠️ Some users already exist in Users_backup — skipping duplicates.');
    } else {
      console.error('❌ Error during backup:', error);
    }
  }
};

// === Start Server ===
const startServer = async () => {
  try {
    await backupUsers();                       // Step 1: Backup users
    //await sequelize.sync({ alter: true });    // Updates schema without deleting data  // Step 2: Sync schema
    //await sequelize.sync({ force: true });  //Drop all existing tables (including all data).
await ssequelize.sync(); // Safe - only creates tables if they don't exist

    console.log('✅ Database connected and synced');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
  }
};

startServer(); // Run the server
