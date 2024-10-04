// src/components/pages/HospitalsPage.jsx
import React, { useState } from "react";
import Map from "../components/Map/Map.jsx";
import HospitalList from "../components/Hospitallist/Hospitallist.jsx";
// import "../../App.css";

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);

  const handleHospitalsLoaded = (hospitalList) => {
    setHospitals(hospitalList);
  };

  return (
    <div className="HospitalsPage">
      <header>
        <h1>Nearby Hospitals for Breast Cancer Screening</h1>
      </header>
      <div className="content">
        <HospitalList onHospitalsLoaded={handleHospitalsLoaded} />
        <Map hospitals={hospitals} />
      </div>
    </div>
  );
};

export default HospitalsPage;
