/*
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
*/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  // for association

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  createdByUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  currentMedications: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  chronicConditions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  vaccinationHistory: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  emergencyContactName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emergencyContactPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  primaryCarePhysician: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  patientImage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'Patients',
});


Patient.belongsTo(User, { foreignKey: 'createdByUserId', as: 'creator' });

module.exports = Patient;

