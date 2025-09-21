// server/sync.js
const sequelize = require('./config/database');

// import all models so Sequelize knows about them
require('./models/User');
require('./models/Role');
require('./models/UserRole');
require('./models/Patient');
require('./models/Appointment');
require('./models/Trip');

// This tells Sequelize to create the tables based on the models
sequelize.sync({ force: true }) // WARNING: force: true deletes and re-creates the tables
  .then(() => {
    console.log('✅ Database synced successfully!');
    process.exit(); // stop the script after syncing
  })
  .catch((err) => {
    console.error('❌ Error syncing database:', err);
  });
