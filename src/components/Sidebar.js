// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";  // ✅ IMPORTANTE
import "./Sidebar.css";

const Sidebar = () => {
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
        <li>
          <Link to="/configurazione">Configurazione</Link> {/* NUOVA VOCE */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
