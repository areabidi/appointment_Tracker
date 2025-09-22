/*const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

// One-to-many: Patient can have many appointments
Appointment.belongsTo(Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Patient.hasMany(Appointment, { foreignKey: 'patientId' });

module.exports = Appointment;
*/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // Date only (or you can use DATETIME if storing time together)
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  // New: Title or purpose of appointment
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Start and end times (stored as TIME)
  startTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },

  endTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  doctor: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  companion: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  noteImage: {
    type: DataTypes.TEXT, // store base64 or URL
    allowNull: true,
  },

  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

// Relationships
Appointment.belongsTo(Patient, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Patient.hasMany(Appointment, { foreignKey: 'patientId' });

module.exports = Appointment;
