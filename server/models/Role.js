const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // adjust path to your db config

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Role;
