// src/App.js
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ViewBooks from "./components/ViewBooks";
import AddBook from "./components/AddBook.js";
import "./App.css";
import backgroundImage from './assets/background.jpg';


function App() {
  const [selectedView, setSelectedView] = useState("view");

  const renderContent = () => {
    if (selectedView === "view") {
      return <ViewBooks />;
    } else if (selectedView === "add") {
      return <AddBook />;
    }
    return null;
  };

  return (
    <div className="app-container">
      <Sidebar onSelect={setSelectedView} />
      <main
        className="main-content"
        style={{
          background: `url(${backgroundImage}) no-repeat center center fixed`,
          backgroundSize: 'cover',
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
