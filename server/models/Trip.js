const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./Appointment');
const User = require('./User'); // Driver is a User

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pickupTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dropoffTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
  },
}, {
  timestamps: true,
});

// Each Trip belongs to one Appointment
Trip.belongsTo(Appointment, { foreignKey: 'appointmentId', onDelete: 'CASCADE' });
Appointment.hasMany(Trip, { foreignKey: 'appointmentId' });

// Each Trip is driven by one User (Driver)
Trip.belongsTo(User, { as: 'Driver', foreignKey: 'driverId', onDelete: 'SET NULL' });
User.hasMany(Trip, { foreignKey: 'driverId' });

module.exports = Trip;
