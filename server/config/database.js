/* database.js = Connects to the Database
📍 Location: server/config/database.js
Think of this as the plug that connects your app to the database.
It sets up the connection using Sequelize and SQLite.
What it does:
Tells your app where the database is (e.g., a file called database.sqlite)
Prepares Sequelize to work with that database
✅ You usually only touch this once unless you change your database setup. */


// server/config/database.js

const { Sequelize } = require('sequelize');  // Import Sequelize ORM
const path = require('path');                  // Import path module to handle file paths

// Create a new Sequelize instance, connecting to a SQLite database file
const sequelize = new Sequelize({
  dialect: 'sqlite',                           // Use SQLite dialect
  storage: path.join(__dirname, '../database.sqlite'),  // Path to SQLite database file (relative to this file)
  logging: false,                              // Disable SQL query logging in the console (optional)
});

module.exports = sequelize;                    // Export the Sequelize instance for use in other files

