const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Patient = require('./Patient');

const PatientPermission = sequelize.define('PatientPermission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  permissionType: {
    type: DataTypes.STRING, // e.g., 'view', 'edit', 'attend'
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Associations
PatientPermission.belongsTo(User, { foreignKey: 'userId' });
PatientPermission.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = PatientPermission;
