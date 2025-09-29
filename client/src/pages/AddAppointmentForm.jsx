import React, { useState, useEffect } from 'react';

function AddAppointmentForm({ onAppointmentAdded }) {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    doctor: '',
    companion: '',
    notes: '',
    status: 'pending',
    patientId: '', // must match an existing patient
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Fetch patient list for dropdown
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(err => console.error('Failed to load patients', err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create appointment');
      const data = await res.json();

      setSuccessMsg('✅ Appointment added successfully!');
      setFormData({
        appointmentDate: '',
        title: '',
        startTime: '',
        endTime: '',
        location: '',
        doctor: '',
        companion: '',
        notes: '',
        status: 'pending',
        patientId: '',
      });

      if (onAppointmentAdded) onAppointmentAdded(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('❌ Failed to add appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
      <h3>Add New Appointment</h3>

      <label>
        Patient:
        <select name="patientId" value={formData.patientId} onChange={handleChange} required>
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>
              {p.User?.name || 'Unnamed'} (User ID: {p.userId})
            </option>
          ))}
        </select>
      </label>

      <br />

      <label>
        Title:
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </label>

      <br />

      <label>
        Date:
        <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
      </label>

      <br />

      <label>
        Start Time:
        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
      </label>

      <br />

      <label>
        End Time:
        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
      </label>

      <br />

      <label>
        Doctor:
        <input type="text" name="doctor" value={formData.doctor} onChange={handleChange} />
      </label>

      <br />

      <label>
        Location:
        <input type="text" name="location" value={formData.location} onChange={handleChange} />
      </label>

      <br />

      <label>
        Companion:
        <input type="text" name="companion" value={formData.companion} onChange={handleChange} />
      </label>

      <br />

      <label>
        Notes:
        <textarea name="notes" value={formData.notes} onChange={handleChange} />
      </label>

      <br />

      <label>
        Status:
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>

      <br />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Appointment'}
      </button>

      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </form>
  );
}

export default AddAppointmentForm;
