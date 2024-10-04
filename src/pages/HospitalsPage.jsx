import React, { useState } from "react";
import Map from "../components/Map/Map.jsx";
import HospitalList from "../components/Hospitallist/Hospitallist.jsx";

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const currentLocation = { lat: 3.848, lng: 11.502 }; // Placeholder for the current user location

  const handleHospitalsLoaded = (hospitalList) => {
    setHospitals(hospitalList);
  };

  return (
    <div className="HospitalsPage">
      <header>
        <h1>Nearby Hospitals for Breast Cancer Screening</h1>
      </header>
      <div className="content">
        <Map hospitals={hospitals} currentLocation={currentLocation} />
        <HospitalList
          onHospitalsLoaded={handleHospitalsLoaded}
          currentLocation={currentLocation}
        />
      </div>
    </div>
  );
};

export default HospitalsPage;
