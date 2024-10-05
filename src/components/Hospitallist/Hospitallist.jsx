import React, { useState, useEffect } from "react";
import { getHospitals } from "../../services/HospitalService.js";
import "./Hospitallist.css"; 
import Draggable from 'react-draggable';

const HospitalList = ({ onHospitalsLoaded, currentLocation }) => {
  const [hospitals, setHospitals] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {

    console.log("this is api key !!!" +API_KEY)
    const fetchHospitals = async () => {
      const hospitalList = await getHospitals();
  
      // Sort hospitals based on their distance from the currentLocation
      const sortedHospitals = hospitalList.map((hospital) => {
        const distance = calculateDistance({ latitude: hospital.latitude, longitude: hospital.longitude });
        return { ...hospital, distance };
      }).sort((a, b) => a.distance - b.distance); // Sort by ascending distance
  
      setHospitals(sortedHospitals);
      onHospitalsLoaded(sortedHospitals);
    };
  
    fetchHospitals();
  }, []);



useEffect(() => {
  const fetchUserAddress = async () => {
    const { lat, lng } = currentLocation;

    // Use Google Maps Geocoding API or a similar reverse geocoding service
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&${API_KEY}`);
    const data = await response.json();

    if (data.results && data.results[0]) {
      setUserAddress(data.results[0].formatted_address);
    } else {
      setUserAddress("Unknown location");
    }
  };

  if (currentLocation) {
    fetchUserAddress();
  }
}, []);

  const calculateDistance = (hospitalLocation) => {
    if (!hospitalLocation || !hospitalLocation.latitude || !hospitalLocation.longitude) {
      return "N/A";
    }

    const { latitude, longitude } = hospitalLocation;
    const R = 6371; 
    const dLat = (latitude - currentLocation.lat) * (Math.PI / 180);
    const dLon = (longitude - currentLocation.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(currentLocation.lat * (Math.PI / 180)) *
        Math.cos(latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  // Event handler for share button click
  const handleShare = (hospital) => {
    console.log("Sharing Hospital Information:", hospital);
  };

  return (

    <Draggable axis="y">
    <div className="hospital-list">
      <div className="bottom-sheet">
        <h2>Hospitals Offering Breast Cancer Screening</h2>
        <h3>Current Location: {userAddress}</h3>
        <ul>
          {hospitals.map((hospital) => (
            <li key={hospital.id} className="hospital-item">
              <div className="hospital-header">
                <h3>{hospital.address || "No Name"}</h3>
                <p className="hospital-distance">
                  {calculateDistance(hospital)} km away
                </p>
              </div>
              <div className="hospital-details">
                <p className="hospital-address">{hospital.name}</p>
                <p>
                  {hospital.ouvertureDate
                    ? `Open: ${hospital.ouvertureDate} ${hospital.ouvertureTime || ""}`
                    : "Open Date/Time not available"}
                  {hospital.fermetureDate
                    ? ` - Close: ${hospital.fermetureDate} ${hospital.fermetureTime || ""}`
                    : ""}
                </p>
                {hospital.inPromotion && <span className="promotion-tag">In Promotion</span>}
                {hospital.phone && (
                  <p className="hospital-phone">Phone: {hospital.phone}</p>
                )}
                {hospital.price && (
                  <p className="hospital-price">
                    Price: {hospital.price} FCFA
                    {hospital.reductionPrice && (
                      <span className="reduction-price">
                        {" "} {hospital.reductionPrice} FCFA)
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="hospital-actions">
                <button className="btn-direction">Directions</button>
                <button className="btn-call">Call</button>
                <button onClick={() => handleShare(hospital)} className="btn-share">Share</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </Draggable>
  );
};

export default HospitalList;
