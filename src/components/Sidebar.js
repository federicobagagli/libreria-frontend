// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";  // ✅ IMPORTANTE
import "./Sidebar.css";

const Sidebar = ({ onLogout }) => {
  let role = null;
  const token = localStorage.getItem('jwtToken');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role;
    } catch (e) {
      console.error("Errore nella decodifica del token:", e);
    }
  }

  return (
    <div className="sidebar">
      <h2>📚 Libreria</h2>
      <ul>
        <li>
          <Link to="/">Visualizza Libreria</Link>
        </li>
        <li>
          <Link to="/add">Inserisci Libro</Link>
        </li>
        <li><Link to="/records">Visualizza Discoteca</Link></li>
        <li>
            <Link to="/add-record">Inserisci Disco</Link>
        </li>
        {role === 'ROLE_ADMIN' && (
          <li>
            <Link to="/configurazione">Configurazione</Link>
          </li>
        )}
      </ul>
      <button
        onClick={onLogout}
        style={{
          marginTop: 'auto',
          width: '100%',
          padding: '10px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>

    </div>
  );
};


export default Sidebar;
