import React, { useState, useEffect } from "react";
import { getHospitals } from "../../services/HospitalService.js";
import "./Hospitallist.css"; 
import { Sheet, SheetRef } from 'react-modal-sheet';

const HospitalList = ({ onHospitalsLoaded, currentLocation }) => {
  const [hospitals, setHospitals] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [isOpen, setIsOpen] = useState(true); // Control for modal sheet
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    console.log("this is api key !!!" + API_KEY);
  
    const fetchHospitals = async () => {
      try {
        const hospitalList = await getHospitals();
  
        // Sort hospitals based on their distance from the currentLocation
        const sortedHospitals = hospitalList.map((hospital) => {
          const distance = calculateDistance({
            latitude: hospital.latitude,
            longitude: hospital.longitude
          });
          return {...hospital, distance};
        }).sort((a, b) => a.distance - b.distance); // Sort by ascending distance
  
        setHospitals(sortedHospitals);
        onHospitalsLoaded(sortedHospitals);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setHospitals([]); // Set to empty array or handle differently based on your UI needs
      }
    };
  
    fetchHospitals();
  }, []); 



  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        if (currentLocation) {
          const { lat, lng } = currentLocation;
  
          // Ensure API_KEY is correctly defined and securely stored
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch address'); // Throws an error if response is not ok
          }
  
          const data = await response.json();
  
          if (data.results && data.results.length > 0) {
            setUserAddress(data.results[0].formatted_address);
          } else {
            setUserAddress("Unknown location");
          }
        }
      } catch (error) {
        console.error('Error fetching user address:', error);
        setUserAddress("Failed to determine location"); // Set error message or handle differently 
      }
    };
  
    fetchUserAddress();
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
    <>
  <button onClick={() => setIsOpen(true)} className="open-sheet-button">
      Show Nearby Hospitals
  </button>
  

      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        snapPoints={[550, 300, 100]}
        initialSnap={0}
        disableDrag={false}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="hospital-list">
              <h2>Hospitals Offering Breast Cancer Screening</h2>
              <h3>Current Location: {userAddress}</h3>
              <ul>
                {hospitals.map((hospital) => (
                  <li key={hospital.id} className="hospital-item">
                    <div className="hospital-header">
                      <h3>{hospital.name || "No Name"}</h3>
                      <p className="hospital-distance">
                        {calculateDistance(hospital)} km away
                      </p>
                    </div>
                    <div className="hospital-details">
                      <p className="hospital-address">{hospital.address}</p>
                      <p>
                        {hospital.ouvertureDate
                          ? `Open: ${hospital.ouvertureDate} ${hospital.ouvertureTime || ""}`
                          : "Open Date/Time not available"}
                        {hospital.fermetureDate
                          ? ` - Close: ${hospital.fermetureDate} ${hospital.fermetureTime || ""}`
                          : ""}
                      </p>
                      {hospital.inPromotion && (
                        <span className="promotion-tag">In Promotion</span>
                      )}
                      {hospital.phone && (
                        <p className="hospital-phone">Phone: {hospital.phone}</p>
                      )}
                      {hospital.price && (
                        <p className="hospital-price">
                          Price: {hospital.price} FCFA
                          {hospital.reductionPrice && (
                            <span className="reduction-price">
                              {" "}
                              {hospital.reductionPrice} FCFA)
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    <div className="hospital-actions">
                      <button className="btn-direction">Directions</button>
                      <button className="btn-call">Call</button>
                      <button
                        onClick={() => handleShare(hospital)}
                        className="btn-share"
                      >
                        Share
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
};

export default HospitalList;