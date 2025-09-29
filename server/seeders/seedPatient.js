// seedPatient.js

const sequelize = require('../config/database');
const Patient = require('../models/Patient');
const User = require('../models/User');



async function seedPatient() {
  try {
    await sequelize.sync();

    // ✅ Make sure this user ID exists in your Users table
    const userId = 1;

    // Check if patient already exists
    const existing = await Patient.findOne({ where: { userId } });
    if (existing) {
      console.log(`Patient already exists for user ${userId}`);
      process.exit(0);
    }

    // Create the patient
    const patient = await Patient.create({
      userId,
      medicalInfo: 'Hypertension and asthma',
      emergencyContact: 'Sarah Doe - 555-111-2222',
    });

    console.log('✅ Patient created:', patient.toJSON());
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding patient:', err);
    process.exit(1);
  }
}

seedPatient();
