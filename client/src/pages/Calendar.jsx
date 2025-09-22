import React, { useState } from 'react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

export default function Calendar() {
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(new Date().getMonth());
  const [appointments, setAppointments] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    doctor: '',
    companion: '',
    notes: '',
    noteImage: null,
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  function resetForm() {
    setFormData({
      title: '',
      startTime: '',
      endTime: '',
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
    if (!selectedDay) return alert('Select a day first');

    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
      return alert('End time must be after start time');
    }

    const appt = {
      day: selectedDay,
      month,
      year,
      ...formData,
    };

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
  }

  function selectDay(day) {
    setSelectedDay(day);
    resetForm();
  }

  function editAppointment(index) {
    const appt = appointments[index];
    setSelectedDay(appt.day);
    setFormData({ ...appt });
    setEditingIndex(index);
  }

  function deleteAppointment(index) {
    if (window.confirm('Delete this appointment?')) {
      setAppointments(appts => appts.filter((_, i) => i !== index));
      resetForm();
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
  }

  // ✅ FIXED: Only show appointments for current day, month, and year
  function appointmentsForDay(day) {
    return appointments.filter(
      appt => appt.day === day && appt.month === month && appt.year === year
    );
  }

  const dayStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    overflow: 'hidden',
    fontSize: '1rem',
    flexGrow: 1,
    minWidth: 0,
    height: 'auto',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    width: '100%',
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, gap: 10 }}>
        <button onClick={handlePrevMonth} style={{ padding: '6px 12px', fontSize: '1rem' }}>
          &lt; Prev
        </button>

        <select
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
          style={{ fontSize: '1.1rem', padding: '6px' }}
        >
          {months.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          style={{ fontSize: '1.1rem', padding: '6px' }}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button onClick={handleNextMonth} style={{ padding: '6px 12px', fontSize: '1rem' }}>
          Next &gt;
        </button>
      </div>

      <div style={{ ...gridStyle, fontWeight: 'bold', textAlign: 'center' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div style={gridStyle}>
        {[...Array(firstDayOfWeek)].map((_, i) => (
          <div key={`empty-${i}`} />
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
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: '2px',
                fontSize: '1.1rem',
              }}
              title={dayAppointments.length ? dayAppointments.map(a => a.title).join(', ') : ''}
            >
              <strong style={{ marginBottom: 6 }}>{dayNum}</strong>
              {dayAppointments.slice(0, 3).map((appt, i) => (
                <div key={i} style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {(appt.startTime ? appt.startTime : '')}
                  {appt.endTime ? ` - ${appt.endTime}` : ''}
                  {appt.startTime || appt.endTime ? ' — ' : ''}
                  {appt.title}
                </div>
              ))}
              {dayAppointments.length > 3 && <div>+{dayAppointments.length - 3} more</div>}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div style={{ marginTop: 30 }}>
          <h2>Appointments on {months[month]} {selectedDay}, {year}</h2>

          {appointmentsForDay(selectedDay).length === 0 && <p>No appointments for this day.</p>}

          {appointmentsForDay(selectedDay).map((appt, i) => (
            <div
              key={i}
              style={{
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: 12,
                marginBottom: 12,
                backgroundColor: '#fafafa',
              }}
            >
              <div>
                <strong>
                  {(appt.startTime ? appt.startTime : '')}
                  {appt.endTime ? ` - ${appt.endTime}` : ''}
                  {(appt.startTime || appt.endTime) ? ' — ' : ''}
                  {appt.title}
                </strong>
              </div>
              {appt.location && <div><em>Location:</em> {appt.location}</div>}
              {appt.doctor && <div><em>Doctor:</em> {appt.doctor}</div>}
              {appt.companion && <div><em>Companion:</em> {appt.companion}</div>}
              {appt.notes && <div><em>Notes:</em> {appt.notes}</div>}
              {appt.noteImage && (
                <img
                  src={appt.noteImage}
                  alt="Note attachment"
                  style={{ maxWidth: '100%', maxHeight: 200, marginTop: 8, borderRadius: 4 }}
                />
              )}
              <div style={{ marginTop: 8 }}>
                <button onClick={() => editAppointment(appointments.indexOf(appt))} style={{ marginRight: 10 }}>
                  Edit
                </button>
                <button onClick={() => deleteAppointment(appointments.indexOf(appt))}>
                  Delete
                </button>
              </div>
            </div>
          ))}

          <h3>{editingIndex !== null ? 'Edit Appointment' : 'Add Appointment'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500 }}>
            <input
              type="text"
              name="title"
              placeholder="Title *"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ padding: 8, fontSize: '1rem' }}
            />

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <label>
                Start Time:
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  style={{ padding: 8, fontSize: '1rem', marginLeft: 8 }}
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  style={{ padding: 8, fontSize: '1rem', marginLeft: 8 }}
                />
              </label>
            </div>

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              style={{ padding: 8, fontSize: '1rem' }}
            />

            <input
              type="text"
              name="doctor"
              placeholder="Doctor's Name"
              value={formData.doctor}
              onChange={handleChange}
              style={{ padding: 8, fontSize: '1rem' }}
            />

            <input
              type="text"
              name="companion"
              placeholder="Who is taking the patient?"
              value={formData.companion}
              onChange={handleChange}
              style={{ padding: 8, fontSize: '1rem' }}
            />

            <textarea
              name="notes"
              placeholder="Notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              style={{ padding: 8, fontSize: '1rem' }}
            />

            <div>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {formData.noteImage && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={formData.noteImage}
                    alt="Note attachment"
                    style={{ maxWidth: '100%', maxHeight: 150, marginTop: 5, borderRadius: 4 }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(fd => ({ ...fd, noteImage: null }))}
                    style={{ marginTop: 5 }}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            <button type="submit" style={{ padding: 10, fontSize: '1.1rem', cursor: 'pointer' }}>
              {editingIndex !== null ? 'Save Changes' : 'Add Appointment'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
