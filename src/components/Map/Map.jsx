import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const Map = ({ hospitals, currentLocation }) => {
  const [map, setMap] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapCenter, setMapCenter] = useState(currentLocation); 
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
  // Debug logging
  console.log('Map component props:', { hospitals, currentLocation, API_KEY: API_KEY ? 'Found' : 'Missing' });
  const mapStyles = {
    height: "100vh",
    width: "100%",
  };

  const handleDragEnd = () => {
    if (map) {
      const newCenter = map.getCenter();
      setMapCenter({
        lat: newCenter.lat(),
        lng: newCenter.lng(),
      });
    }
  };

  useEffect(() => {
    if (currentLocation) {
      setMapCenter(currentLocation);
    }
  }, [currentLocation]);

  const onLoadMap = (mapInstance) => {
    setMap(mapInstance);
    mapInstance.addListener("dragend", handleDragEnd); // Ensure this event is bound to the map instance
  };

  // Don't render if API key is missing
  if (!API_KEY) {
    return <div>Google Maps API key is missing. Please check your environment variables.</div>;
  }

  // Don't render if currentLocation is not available
  if (!currentLocation) {
    return <div>Loading map...</div>;
  }

  return (
    <LoadScript 
      googleMapsApiKey={API_KEY}
      onError={(error) => console.error('Google Maps LoadScript error:', error)}
    >
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={17}
        mapTypeId="satellite"
        center={mapCenter}
        onLoad={onLoadMap}
        onError={(error) => console.error('GoogleMap error:', error)}
      >

         {/* Custom Marker for User's Current Location */}
         {currentLocation && (
          <Marker
            position={currentLocation}
            title="You are here"
          />
        )}


     {hospitals && hospitals.length > 0 ? hospitals.map((hospital) => (
  hospital.latitude && hospital.longitude ? (
    <Marker
      key={hospital.id}
      position={{ lat: hospital.latitude, lng: hospital.longitude }}
      title={hospital.name}
      onClick={() => setSelectedHospital(hospital)}
    />
  ) : null
)) : null}


        {selectedHospital && (
          <InfoWindow
            position={{ lat: selectedHospital.latitude, lng: selectedHospital.longitude }}
            onCloseClick={() => setSelectedHospital(null)}
          >
            <div>
              <h3>{selectedHospital.name || 'Hospital'}</h3>
              <p>Address: {selectedHospital.address || 'Address not available'}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
