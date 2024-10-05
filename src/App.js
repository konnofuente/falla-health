// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HospitalsPage from "./pages/HospitalsPage.jsx";
import AddHospital from "./components/AddHospital/AddHospital.jsx";
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Links */}
        <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/add-hospital" className="nav-item">Add Hospital</Link>
        </li>
        <li>
          <Link to="/hospitals" className="nav-item">View Hospitals</Link>
        </li>
      </ul>
    </nav>

        {/* Define Routes */}
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<HospitalsPage />} />
          
          {/* Route for Adding Hospital */}
          <Route path="/add-hospital" element={<AddHospital />} />

          {/* Route for Viewing Hospitals */}
          <Route path="/hospitals" element={<HospitalsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
