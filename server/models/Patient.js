const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  medicalInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  emergencyContact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

// One-to-one relationship: One User can have one Patient profile
Patient.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Patient, { foreignKey: 'userId' });

module.exports = Patient;
