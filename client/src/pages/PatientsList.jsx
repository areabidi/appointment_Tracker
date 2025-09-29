import React, { useEffect, useState } from 'react';

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/patients')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch patients');
        return res.json();
      })
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching patients:', err);
        setError('Could not load patients.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (patients.length === 0) return <p>No patients found.</p>;

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {patients.map(patient => (
          <li key={patient.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
            <strong>{patient.User?.name}</strong> <br />
            📧 {patient.User?.email} <br />
            📞 {patient.User?.phone || 'N/A'} <br />
            🏥 <strong>Medical Info:</strong> {patient.medicalInfo || 'N/A'} <br />
            🚨 <strong>Emergency Contact:</strong> {patient.emergencyContact || 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientsList;
