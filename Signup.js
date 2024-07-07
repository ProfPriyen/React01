import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/signup', {
        username,
      });
      alert('User signed up successfully.');
      setUsername('');
    }
     catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred.');
    }
  };
 

  return (
    <div >
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup} method='post'>
      <label >Name</label>
       <input
          type="text"
          placeholder="Username"
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
