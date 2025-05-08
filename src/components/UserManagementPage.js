import React, { useState } from "react";
import axios from "../axiosInstance";
import "./AddBook.css"; // riutilizziamo lo stile base

const UserManagementPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAddUser = async () => {
    try {
      await axios.post("/users", {
        username,
        passwordHash: password,  // il backend lo codifica
        role: "ROLE_USER"
      });
      setMessage("✅ Utente creato con successo!");
      setUsername("");
      setPassword("");
    } catch (error) {
      const msg = error.response?.data?.message || "Errore nella creazione utente.";
      setMessage(`❌ ${msg}`);
      console.error(error);
    }
  };

  return (
    <div className="add-book-container">
      <h2>Crea nuovo utente</h2>
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleAddUser}>Crea Utente</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserManagementPage;
