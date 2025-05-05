import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/apiConfig'; // usa la stessa configurazione API

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
      const token = response.data.token;
      localStorage.setItem('token', token); // salviamo il token
      onLoginSuccess(); // chiamiamo la funzione per notificare successo
    } catch (err) {
      console.error(err);
      setError('Credenziali non valide');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
