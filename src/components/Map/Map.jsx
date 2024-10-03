// src/components/Map.js
import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Map = ({ hospitals }) => {
  const [map, setMap] = useState(null);

  const mapStyles = {
    height: "100vh",
    width: "100%",
  };

  const defaultCenter = {
    lat: 4.0511, // Default to a location in Cameroon
    lng: 9.7679,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDrpp4H_umLRGKaAtdZiwMz0zwXoOTEnFs">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
        onLoad={(map) => setMap(map)}
      >
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={{ lat: hospital.latitude, lng: hospital.longitude }}
            title={hospital.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
