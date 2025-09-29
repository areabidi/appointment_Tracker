import React, { useState, useEffect } from 'react';
import AddPatientForm from './AddPatientForm';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDateTimeLocal(date) {
  const pad = num => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function Calendar() {
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(new Date().getMonth());
  const [appointments, setAppointments] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  // Patients list
  const [patients, setPatients] = useState([]);

  // NEW: which panel to show: 'appointment', 'patient', or null (none)
  const [activePanel, setActivePanel] = useState(null);

// userID logged in currently:
  const [currentUserId, setCurrentUserId] = useState(null);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setCurrentUserId(user.id);
    }
  }, []);




  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/appointments', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
      })
      .catch(err => console.error('Failed to load appointments:', err));
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const [formData, setFormData] = useState({
    title: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    doctor: '',
    companion: '',
    notes: '',
    noteImage: null,
  });

  function resetForm() {
    setFormData({
      title: '',
      startDateTime: '',
      endDateTime: '',
      location: '',
      doctor: '',
      companion: '',
      notes: '',
      noteImage: null,
    });
    setEditingIndex(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(fd => ({ ...fd, noteImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title) return alert('Title is required');
    if (!formData.startDateTime) return alert('Start date/time is required');
    if (!formData.endDateTime) return alert('End date/time is required');
    if (formData.endDateTime <= formData.startDateTime) return alert('End date/time must be after start date/time');

    const appt = { ...formData };

    if (editingIndex !== null) {
      setAppointments(appts => {
        const copy = [...appts];
        copy[editingIndex] = appt;
        return copy;
      });
    } else {
      setAppointments(appts => [...appts, appt]);
    }

    resetForm();
    setActivePanel(null);  // Close appointment form panel after submit
    setSelectedDay(null);
  }

  function selectDay(day) {
    setSelectedDay(prev => (prev === day ? null : day));
    resetForm();
    if (day !== selectedDay) {
      setActivePanel('appointment'); // Show appointment form when a day is selected
    } else {
      setActivePanel(null); // Close if day deselected
    }
  }

  function editAppointment(index) {
    const appt = appointments[index];
    const dt = new Date(appt.startDateTime);
    setYear(dt.getFullYear());
    setMonth(dt.getMonth());
    setSelectedDay(dt.getDate());
    setFormData({ ...appt });
    setEditingIndex(index);
    setActivePanel('appointment');  // Show appointment form panel
  }

  function deleteAppointment(index) {
    if (window.confirm('Delete this appointment?')) {
      setAppointments(appts => appts.filter((_, i) => i !== index));
      resetForm();
      setActivePanel(null);
      setSelectedDay(null);
    }
  }

  function handlePrevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
    setSelectedDay(null);
    resetForm();
    setActivePanel(null);
  }

  function handleNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
    setSelectedDay(null);
    resetForm();
    setActivePanel(null);
  }

  function appointmentsForDay(day) {
    const dayStart = new Date(year, month, day, 0, 0, 0);
    const dayEnd = new Date(year, month, day, 23, 59, 59);

    return appointments.filter(appt => {
      const apptStart = new Date(appt.startDateTime);
      const apptEnd = new Date(appt.endDateTime);
      return apptStart <= dayEnd && apptEnd >= dayStart;
    });
  }

  // Style objects kept as you had them
  const dayStyle = {
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '10px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    overflow: 'hidden',
    fontSize: '1rem',
    minHeight: '120px',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    width: '100%',
  };

  // Handler for saving patient and closing form
  function handleSavePatient(patient) {
    setPatients(prev => [...prev, patient]);
    setActivePanel(null); // Close patient form panel after save
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h1 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Appointment Tracker</h1>
        <button
          className="small-btn"
          onClick={() => setActivePanel(prev => (prev === 'patient' ? null : 'patient'))}
        >
          Add Patient
        </button>
        <button className="small-btn">List of Patients</button>
      </div>

      {/* Container for calendar and side panel */}
      <div
        className="calendar-container"
        style={{
          display: 'flex',
          gap: 40,
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 20,
          flexWrap: 'wrap',
        }}
      >
        {/* Calendar */}
        <div style={{ flex: 2, maxWidth: 700 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            <button onClick={handlePrevMonth}>&lt; Prev</button>
            <select value={month} onChange={e => setMonth(Number(e.target.value))}>
              {months.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <select value={year} onChange={e => setYear(Number(e.target.value))}>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button onClick={handleNextMonth}>Next &gt;</button>
          </div>

          <div style={{ ...gridStyle, fontWeight: 'bold', textAlign: 'center' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div style={gridStyle}>
            {[...Array(firstDayOfWeek)].map((_, i) => (
              <div key={`empty-${i}`} style={{ ...dayStyle, visibility: 'hidden', cursor: 'default' }} />
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const dayAppointments = appointmentsForDay(dayNum);

              return (
                <div
                  key={dayNum}
                  onClick={() => selectDay(dayNum)}
                  style={{
                    ...dayStyle,
                    backgroundColor: selectedDay === dayNum ? '#e0f7fa' : '#fff',
                  }}
                >
                  <strong>{dayNum}</strong>
                  {dayAppointments.slice(0, 3).map((appt, i) => {
                    const startTime = new Date(appt.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const endTime = new Date(appt.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div
                        key={i}
                        style={{
                          backgroundColor: '#4db6ac',
                          color: '#fff',
                          borderRadius: '4px',
                          padding: '2px 4px',
                          marginTop: '2px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={appt.title}
                        onClick={e => {
                          e.stopPropagation();
                          editAppointment(appointments.indexOf(appt));
                        }}
                      >
                        {`${startTime}-${endTime}: ${appt.title}`}
                      </div>
                    );
                  })}
                  {dayAppointments.length > 3 && (
                    <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDE PANEL: Shows either Add Patient or Appointment Form based on activePanel */}
        {activePanel && (
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '20px',
              minWidth: '320px',
              maxWidth: '350px',
              background: '#fafafa',
              position: 'relative',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setActivePanel(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                lineHeight: '1',
              }}
              aria-label="Close Panel"
            >
              &times;
            </button>

            {activePanel === 'patient' && (
              <AddPatientForm currentUserId={currentUserId} onSave={handleSavePatient} />
            )}

            {activePanel === 'appointment' && selectedDay && (
              <form onSubmit={handleSubmit}>
                <h2>{editingIndex !== null ? 'Edit' : 'Add'} Appointment on {months[month]} {selectedDay}, {year}</h2>
                <div>
                  <label>Title: *</label>
                  <input
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Start Date & Time: *</label>
                  <input
                    name="startDateTime"
                    type="datetime-local"
                    value={formData.startDateTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>End Date & Time: *</label>
                  <input
                    name="endDateTime"
                    type="datetime-local"
                    value={formData.endDateTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Location:</label>
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Doctor:</label>
                  <input
                    name="doctor"
                    type="text"
                    value={formData.doctor}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Companion:</label>
                  <input
                    name="companion"
                    type="text"
                    value={formData.companion}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Notes:</label>
                  <textarea
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
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                <div>
                  <label>Note Image:</label>
                  <input
                    name="noteImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {formData.noteImage && (
                    <img src={formData.noteImage} alt="Note" style={{ maxWidth: '100%', marginTop: 10 }} />
                  )}
                </div>
                <button type="submit">{editingIndex !== null ? 'Update' : 'Add'} Appointment</button>
                {editingIndex !== null && (
                  <button
                    type="button"
                    onClick={() => deleteAppointment(editingIndex)}
                    style={{ marginLeft: 10, backgroundColor: 'red', color: 'white' }}
                  >
                    Delete
                  </button>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
}
