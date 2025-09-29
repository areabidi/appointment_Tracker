import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after login
import './styles.css'; // Import shared styles
import { Link } from 'react-router-dom';


export default function Login() {
  const navigate = useNavigate(); // React Router hook to navigate programmatically

  // State to hold form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State to show success or error messages
  const [message, setMessage] = useState('');

  // Update formData when user types in input fields
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submit behavior

    try {
      // Send login request to backend
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Send email and password
      });

      const data = await res.json(); // Parse JSON response

      if (res.ok) {
        setMessage('Login successful!');
        // Example login response: { userId: 123, message: 'Login successful' }
        //localStorage.setItem('user', JSON.stringify({ id: response.userId }));
        localStorage.setItem('user', JSON.stringify({ id: data.userId }));

        localStorage.setItem('token', data.token); // Save JWT token in local storage
        navigate('/calendar'); // Redirect to calendar page after login
      } else {
        // Show error message from server
        setMessage(`Error: ${data.error || 'Failed to login'}`);
      }
    } catch (err) {
      // Catch network/server errors
      setMessage('An error occurred while trying to login.');
    }
  }

  return (
    <div  className="form-container">
      <h2>Appointment Tracker</h2>

      {/* Show success or error messages */}
      {message && <p>{message}</p>}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
       
        <button type="submit">Login</button>
      </form>
     <Link to="/register">Register now</Link>
    </div>
  );
}
