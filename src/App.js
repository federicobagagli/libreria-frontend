// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Sidebar from "./components/Sidebar";
import ViewBooks from "./components/ViewBooks";
import AddBook from "./components/AddBook.js";
import "./App.css";
import backgroundImage from './assets/3d-background-with-white-cubes.jpg';
import ConfigurationPage from "./components/ConfigurationPage";


function App() {
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
