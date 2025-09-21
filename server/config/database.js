/* database.js = Connects to the Database
📍 Location: server/config/database.js
Think of this as the plug that connects your app to the database.
It sets up the connection using Sequelize and SQLite.
What it does:
Tells your app where the database is (e.g., a file called database.sqlite)
Prepares Sequelize to work with that database
✅ You usually only touch this once unless you change your database setup. */


// server/config/database.js
const { Sequelize } = require('sequelize');

// This creates the connection to a file-based database called database.sqlite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // This is like your database file
  logging: false,               // Turn off messages in the terminal (optional)
});

module.exports = sequelize; // export it so you can use it in other files
