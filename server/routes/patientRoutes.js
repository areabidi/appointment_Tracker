const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/PatientController');

// Add new patient
router.post('/', PatientController.addPatient);

// Optional: get all patients (for current user)
router.get('/', PatientController.getPatients);

// Delete patient by ID
router.delete('/:id', PatientController.deletePatient);

module.exports = router;
