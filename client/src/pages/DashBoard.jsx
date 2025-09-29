import React, { useState } from 'react';
import PatientsList from './PatientsList';
import AppointmentsList from './AppointmentsList';
import AddPatientForm from './AddPatientForm';
import AddAppointmentForm from './AddAppointmentForm';

function Dashboard() {
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddAppointment, setShowAddAppointment] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📅 Appointment Tracker Dashboard</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>👥 Patients</h2>
        <button onClick={() => setShowAddPatient(!showAddPatient)}>
          {showAddPatient ? 'Cancel' : '➕ Add Patient'}
        </button>
        {showAddPatient && <AddPatientForm />}
        <PatientsList />
      </div>

      <div>
        <h2>📆 Upcoming Appointments</h2>
        <button onClick={() => setShowAddAppointment(!showAddAppointment)}>
          {showAddAppointment ? 'Cancel' : '➕ Add Appointment'}
        </button>
        {showAddAppointment && <AddAppointmentForm />}
        <AppointmentsList />
      </div>
    </div>
  );
}

export default Dashboard;
