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


const { DataTypes } = require('sequelize');
const sequelize = require('../database');
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



//default Appointment:


module.exports = Appointment;
*/

/*| **Column Name**   | **Data Type**                | **Nullable** | **Default** | **Description**                              |
| ----------------- | ---------------------------- | ------------ | ----------- | -------------------------------------------- |
| `id`              | INTEGER (PK, Auto Increment) | ❌            | Auto        | Unique identifier for each appointment       |
| `appointmentDate` | DATEONLY                     | ❌            | —           | Date of the appointment (YYYY-MM-DD)         |
| `title`           | STRING                       | ❌            | —           | Title or reason for the appointment          |
| `startTime`       | TIME                         | ✅            | —           | Start time of the appointment                |
| `endTime`         | TIME                         | ✅            | —           | End time of the appointment                  |
| `location`        | STRING                       | ✅            | —           | Location of the appointment                  |
| `doctor`          | STRING                       | ✅            | —           | Doctor associated with the appointment       |
| `companion`       | STRING                       | ✅            | —           | Person accompanying the patient              |
| `notes`           | TEXT                         | ✅            | —           | Additional notes or details                  |
| `noteImage`       | TEXT                         | ✅            | —           | Image associated with notes (base64 or URL)  |
| `status`          | ENUM                         | ❌            | `'pending'` | Appointment status: pending, confirmed, etc. |
| `patientId`       | INTEGER (FK)                 | ❌            | —           | Links to `Patients(id)`                      |
| `createdAt`       | DATETIME                     | ❌            | Auto        | Timestamp when appointment was created       |
| `updatedAt`       | DATETIME                     | ❌            | Auto        | Timestamp when appointment was last updated  |
Foreign Key: patientId references the Patients table (Patients.id)
Cascade Delete: If a patient is deleted, their appointments are also deleted (onDelete: 'CASCADE').
*/
/*

So, here’s how it typically works:

Backend Server (e.g., Node.js/Express):

Connects to your database.sqlite file.

Has API endpoints like /api/appointments to fetch, add, edit, and delete appointments.

Talks to the React frontend via HTTP requests.

React Frontend:

Calls those backend APIs (using fetch or axios) to get data.

Shows data in the UI and sends updates back to the backend. */



const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const User = require('./User');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  doctorId: {
    type: DataTypes.STRING,  // Not a FK, so can be string or number depending on your use case
    allowNull: true,
  },
  companionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  noteImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

// Associations (optional)
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });
Appointment.belongsTo(User, { foreignKey: 'companionId', as: 'companion' });

module.exports = Appointment;
