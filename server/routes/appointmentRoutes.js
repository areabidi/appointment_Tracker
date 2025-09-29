const express = require('express');
const router = express.Router();

// Simple test route
router.get('/', (req, res) => {
  console.log("GET /api/appointments hit!");
  res.json([{ id: 1, title: 'Test Appointment', startDateTime: new Date(), endDateTime: new Date() }]);
});

module.exports = router;
