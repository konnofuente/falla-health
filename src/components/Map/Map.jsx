import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const Map = ({ hospitals }) => {
  const [map, setMap] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 4.0511, lng: 9.7679 });
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
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

  const onLoadMap = (mapInstance) => {
    setMap(mapInstance);
    mapInstance.addListener("dragend", handleDragEnd); // Ensure this event is bound to the map instance
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={12}
        center={mapCenter}
        onLoad={onLoadMap}
      >
     {hospitals.map((hospital) => (
  hospital.latitude && hospital.longitude ? (
    <Marker
      key={hospital.id}
      position={{ lat: hospital.latitude, lng: hospital.longitude }}
      title={hospital.name}
      onClick={() => setSelectedHospital(hospital)}
    />
  ) : null
))}


        {selectedHospital && (
          <InfoWindow
            position={{ lat: selectedHospital.latitude, lng: selectedHospital.longitude }}
            onCloseClick={() => setSelectedHospital(null)}
          >
            <div>
              <h3>{selectedHospital.name}</h3>
              <p>Open: {selectedHospital.ouverture} - Close: {selectedHospital.fermeture}</p>
              {selectedHospital.inPromotion && <p>Currently in Promotion!</p>}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
