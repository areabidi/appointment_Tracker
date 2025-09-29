const Patient = require('../models/Patient');

exports.addPatient = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      bloodType,
      allergies,
      currentMedications,
      chronicConditions,
      vaccinationHistory,
      emergencyContactName,
      emergencyContactPhone,
      primaryCarePhysician,
      patientImage,
      createdByUserId,
    } = req.body;

    // Basic validation (require fullName and createdByUserId)
    if (!fullName || !createdByUserId) {
      return res.status(400).json({ error: 'Full name and user ID are required' });
    }

    // Create patient in DB
    const newPatient = await Patient.create({
      fullName,
      dateOfBirth,
      bloodType,
      allergies,
      currentMedications,
      chronicConditions,
      vaccinationHistory,
      emergencyContactName,
      emergencyContactPhone,
      primaryCarePhysician,
      patientImage,
      createdByUserId,
    });

    return res.status(201).json(newPatient);
  } catch (error) {
    console.error('Add patient error:', error);
    return res.status(500).json({ error: 'Server error while adding patient' });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const userId = req.query.userId; // or get from auth middleware
    const patients = await Patient.findAll({ where: { createdByUserId: userId } });
    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Server error fetching patients' });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId; // Ideally get from auth middleware

    const patient = await Patient.findOne({ where: { id } });

    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    if (patient.createdByUserId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this patient' });
    }

    await patient.destroy();
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ error: 'Server error deleting patient' });
  }
};
