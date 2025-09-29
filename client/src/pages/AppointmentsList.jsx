import React, { useEffect, useState } from 'react';

function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/appointments')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch appointments');
        return res.json();
      })
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching appointments:', err);
        setError('Could not load appointments.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (appointments.length === 0) return <p>No upcoming appointments.</p>;

  return (
    <div>
      <h2>Upcoming Appointments</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {appointments.map(appointment => (
          <li key={appointment.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
            <strong>{appointment.title}</strong> <br />
            📅 {appointment.appointmentDate} <br />
            🕒 {appointment.startTime} - {appointment.endTime} <br />
            👨‍⚕️ Doctor: {appointment.doctor || 'N/A'} <br />
            📍 Location: {appointment.location || 'N/A'} <br />
            📝 Notes: {appointment.notes || 'None'} <br />
            👥 Companion: {appointment.companion || 'None'} <br />
            🚦 Status: <em>{appointment.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentsList;
