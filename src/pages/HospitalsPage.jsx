import React, { useState, useEffect } from "react";
import Map from "../components/Map/Map.jsx";
import HospitalList from "../components/Hospitallist/Hospitallist.jsx";

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null); // Initially set to null

  // Function to handle hospitals loaded event
  const handleHospitalsLoaded = (hospitalList) => {
    setHospitals(hospitalList);
  };

  // Get user's current location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location: ", error);
          // Fallback to a default location (in case user denies location access)
          setCurrentLocation({ lat: 3.848, lng: 11.502 }); // You can set a default city location
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCurrentLocation({ lat: 3.848, lng: 11.502 }); // Fallback to default location
    }
  }, []);

  // Display a loading message until we have the current location
  if (!currentLocation) {
    return <p>Loading current location...</p>;
  }

  return (
    <div className="HospitalsPage">
      <header>
        <h1>Nearby Hospitals for Breast Cancer Screening</h1>
      </header>
      <div className="content">
        <Map hospitals={hospitals} />
        <HospitalList
          onHospitalsLoaded={handleHospitalsLoaded}
          currentLocation={currentLocation}
        />
      </div>
    </div>
  );
};

export default HospitalsPage;
