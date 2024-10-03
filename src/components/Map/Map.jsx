import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Map = ({ hospitals }) => {
  const [map, setMap] = useState(null);
  
  // Default center in state
  const [mapCenter, setMapCenter] = useState({
    lat: 4.0511,
    lng: 9.7679,
  });

  const mapStyles = {
    height: "100vh",
    width: "100%",
  };

  // Function to update center when drag ends
  const handleDragEnd = () => {
    if (map) {
      const newCenter = map.getCenter();
      setMapCenter({
        lat: newCenter.lat(),
        lng: newCenter.lng(),
      });
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDrpp4H_umLRGKaAtdZiwMz0zwXoOTEnFs">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={12}
        center={mapCenter} // Bind center to the state
        onLoad={(mapInstance) => setMap(mapInstance)}
        onDragEnd={handleDragEnd} // Handle drag end to update the center
      >
        {hospitals.map((hospital) => {
          // Ensure valid lat/lng values
          if (
            typeof hospital.latitude === "number" &&
            typeof hospital.longitude === "number"
          ) {
            return (
              <Marker
                key={hospital.id}
                position={{ lat: hospital.latitude, lng: hospital.longitude }}
                title={hospital.name}
              />
            );
          } else {
            console.warn(
              `Invalid coordinates for hospital: ${hospital.name}`,
              hospital.latitude,
              hospital.longitude
            );
            return null; // Skip rendering invalid markers
          }
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
