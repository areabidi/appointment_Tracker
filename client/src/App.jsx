import React from 'react';
import { Link } from 'react-router-dom';

 function App() {
  return (
    <div>
      <nav>
        <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
      </nav>
      <h1>Welcome to Appointment Tracker</h1>
      <p>Please register or login.</p>
    </div>
  );
}


export default App
