// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect,useState } from "react";
import Sidebar from "./components/Sidebar";
import ViewBooks from "./components/ViewBooks";
import AddBook from "./components/AddBook.js";
import ConfigurationPage from "./components/ConfigurationPage";
import LoginPage from "./components/LoginPage"; // nuovo componente
import "./App.css";
import backgroundImage from './assets/3d-background-with-white-cubes.jpg';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('jwtToken', token);
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // decodifica payload JWT
      localStorage.setItem('userRole', payload.role);
    } catch (e) {
      console.error("Token JWT non valido:", e);
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userRole');
    }
    
    setIsLoggedIn(true);
  };
  
  

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = (payload.exp * 1000) < Date.now();
        if (isExpired) {
          localStorage.clear();
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Errore nella decodifica del token:", e);
        localStorage.clear();
        setIsLoggedIn(false);
      }
    }
  }, []);
  

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main
          className="main-content"
          style={{
            background: `url(${backgroundImage}) no-repeat center center fixed`,
            backgroundSize: 'cover',
          }}
        >
          <Routes>
            <Route path="/" element={<ViewBooks />} />
            <Route path="/add" element={<AddBook />} />
            <Route path="/configurazione" element={<ConfigurationPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
