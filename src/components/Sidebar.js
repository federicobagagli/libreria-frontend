// src/components/Sidebar.js
import React from "react";
import "./Sidebar.css";

const Sidebar = ({ onSelect }) => {
  return (
    <div className="sidebar">
      <h2>📚 Libreria</h2>
      <ul>
        <li onClick={() => onSelect("view")}>Visualizza Libreria</li>
        <li onClick={() => onSelect("add")}>Inserisci Libro</li>
      </ul>
    </div>
  );
};

export default Sidebar;
