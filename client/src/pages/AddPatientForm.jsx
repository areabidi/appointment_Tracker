import React, { useState } from 'react';

function AddPatientForm({ currentUserId, onPatientAdded, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    bloodType: '',
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
    vaccinationHistory: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    primaryCarePhysician: '',
    patientImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, patientImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const payload = {
      ...formData,
      createdByUserId: currentUserId,
    };

    try {
      const res = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create patient');
      const data = await res.json();

      setSuccessMsg('✅ Patient added successfully!');
      setFormData({
         createdByUserId: currentUserId,  // from props
        fullName: '',
        dateOfBirth: '',
        bloodType: '',
        allergies: '',
        currentMedications: '',
        chronicConditions: '',
        vaccinationHistory: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        primaryCarePhysician: '',
        patientImage: null,
      });

      if (onPatientAdded) onPatientAdded(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('❌ Failed to add patient.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '8px',
        maxWidth: '400px',
      }}
    >

     
      <h3>Add New Patient</h3>
      <p>Logged in user ID: <strong>{currentUserId}</strong></p>


      <label htmlFor="fullName">
        Full Name: *
        <br />
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          required
          placeholder="Enter full name"
        />
      </label>
      <br />

      <label htmlFor="dateOfBirth">
        Date of Birth:
        <br />
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
      </label>
      <br />

      <label htmlFor="bloodType">
        Blood Type:
        <br />
        <input
          id="bloodType"
          name="bloodType"
          type="text"
          value={formData.bloodType}
          onChange={handleChange}
          placeholder="e.g., A+, O-, AB+"
        />
      </label>
      <br />

      <label htmlFor="allergies">
        Allergies:
        <br />
        <textarea
          id="allergies"
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          placeholder="E.g., medications, foods"
          rows={2}
          style={{
            fontFamily: 'inherit',
            fontSize: '1rem',
            padding: '0.3em 0.5em',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box',
            resize: 'vertical',
            minHeight: '3em',
          }}
        />
      </label>
      <br />

      <label htmlFor="currentMedications">
        Current Medications:
        <br />
        <textarea
          id="currentMedications"
          name="currentMedications"
          value={formData.currentMedications}
          onChange={handleChange}
          placeholder="List medications being taken"
          rows={2}
          style={{
            fontFamily: 'inherit',
            fontSize: '1rem',
            padding: '0.3em 0.5em',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box',
            resize: 'vertical',
            minHeight: '3em',
          }}
        />
      </label>
      <br />

      <label htmlFor="chronicConditions">
        Chronic Conditions / Past Illnesses:
        <br />
        <textarea
          id="chronicConditions"
          name="chronicConditions"
          value={formData.chronicConditions}
          onChange={handleChange}
          placeholder="E.g., diabetes, asthma"
          rows={2}
          style={{
            fontFamily: 'inherit',
            fontSize: '1rem',
            padding: '0.3em 0.5em',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box',
            resize: 'vertical',
            minHeight: '3em',
          }}
        />
      </label>
      <br />

      <label htmlFor="vaccinationHistory">
        Vaccination History:
        <br />
        <textarea
          id="vaccinationHistory"
          name="vaccinationHistory"
          value={formData.vaccinationHistory}
          onChange={handleChange}
          placeholder="Vaccines received"
          rows={2}
          style={{
            fontFamily: 'inherit',
            fontSize: '1rem',
            padding: '0.3em 0.5em',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box',
            resize: 'vertical',
            minHeight: '3em',
          }}
        />
      </label>
      <br />

      <label htmlFor="emergencyContactName">
        Emergency Contact Name:
        <br />
        <input
          id="emergencyContactName"
          name="emergencyContactName"
          type="text"
          value={formData.emergencyContactName}
          onChange={handleChange}
          placeholder="Contact's full name"
        />
      </label>
      <br />

      <label htmlFor="emergencyContactPhone">
        Emergency Contact Phone:
        <br />
        <input
          id="emergencyContactPhone"
          name="emergencyContactPhone"
          type="tel"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
          placeholder="Contact's phone number"
        />
      </label>
      <br />

      <label htmlFor="primaryCarePhysician">
        Primary Care Physician / Healthcare Provider:
        <br />
        <input
          id="primaryCarePhysician"
          name="primaryCarePhysician"
          type="text"
          value={formData.primaryCarePhysician}
          onChange={handleChange}
          placeholder="Doctor's name"
        />
      </label>
      <br />

      <label>
        Patient Image:
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </label>

      {formData.patientImage && (
        <img
          src={formData.patientImage}
          alt="Patient"
          style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '8px' }}
        />
      )}
      <br />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Patient'}
      </button>

      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </form>
  );
}

export default AddPatientForm;
