await Appointment.create({
  appointmentDate: '2025-10-01',
  title: 'Initial Checkup',
  startTime: '09:00',
  endTime: '09:30',
  location: 'Room 101',
  doctor: 'Dr. Smith',
  companion: 'Jane Doe',
  notes: 'Patient first appointment.',
  status: 'confirmed',
  patientId: 1, // 👈 now this is valid!
});
