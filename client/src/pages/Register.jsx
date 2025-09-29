// Import React and useState hook
import React, { useState } from 'react';

// Register component definition
export default function Register() {
  // useState to manage form input data
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: ''
  });

  // useState to store a message for feedback (e.g. success or error)
  const [message, setMessage] = useState('');

  // Function to handle changes in form input fields
  function handleChange(e) {
    // Update the specific field in formData using the name attribute from the input
    setFormData({ ...formData, [e.target.name]: e.target.value });
    /* same as: 
    setFormData({ 
    name: value,
    username: formData.username,
    email: formData.email,
    password: formData.password,
    phone: formData.phone
}); */
  }

  // Function to handle form submission
  /**This marks the function as asynchronous, which allows the use of the await keyword inside.
     It means the function can pause while waiting for promises (like a network request) to resolve, without blocking the whole app. */
  async function handleSubmit(e) {
    /**Prevent Form's Default Behavior
        Normally, submitting a form would reload the page.
        This line prevents that from happening, allowing you to handle the form submission with JavaScript instead.
        This is essential in React (and other modern web apps) where the page should not reload — everything happens dynamically. */
    e.preventDefault(); // Prevent default form submission behavior
    /**fetch(...) is used to send an HTTP request.
    You're sending the request to your backend server running at: */
    // Send POST request to the backend to register the user
    //const res = await fetch('http://localhost:3000/users/register',
     // const res = await fetch('http://localhost:5000/users/register', 
     const res = await fetch('http://localhost:5000/api/users/register',
 {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Specify JSON request body
      body: JSON.stringify(formData), // Convert form data to JSON string
    });

    // Parse the JSON response
    const data = await res.json();

    if (res.ok) {
      // If the response is successful, show success message and clear form
      setMessage('Registration successful! You can now log in.');
      setFormData({ fullName: '', username: '', email: '', password: '', phone: '' });
    } else {
      // If there's an error, display the error message
      setMessage(`Error: ${data.error || 'Failed to register'}`);
    }
  }

  // Render the form UI
  return (
    <div  className="form-container">
      <h2>Register</h2>

      {/* Display message if it exists */}
      {message && <p>{message}</p>}

      {/* Registration form */}
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
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
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
