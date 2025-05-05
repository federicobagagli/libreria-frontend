// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";  // ✅ IMPORTANTE
import "./Sidebar.css";

const Sidebar = () => {
  let role = null;
  const token = localStorage.getItem('token');

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
        {role === 'ROLE_ADMIN' && (
          <li>
            <Link to="/configurazione">Configurazione</Link>
          </li>
        )}
      </ul>
    </div>
  );
};


export default Sidebar;
