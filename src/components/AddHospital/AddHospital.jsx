import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { addHospital } from "../../services/HospitalService.js"; // Import the service function


const containerStyle = {
    width: '100%',
    height: '400px'
  };
  
  const center = {
    lat: 3.8480, // Default center (Yaoundé, Cameroon)
    lng: 11.5021
  };
  
  const libraries = ['places']; // Use only 'places' library
  
  const AddHospital = () => {
    const [formData, setFormData] = useState({
      name: "",
      address: "",
      ouverture: "",
      fermeture: "",
      inPromotion: false,
      latitude: 3.8480, // Default latitude
      longitude: 11.5021, // Default longitude
    });
  
    // Use the correct API key, and make sure it's consistent
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: 'AIzaSyDrpp4H_umLRGKaAtdZiwMz0zwXoOTEnFs', // Use your real Google Maps API key
      libraries: ['places'], // Ensure the library stays consistent
    });
  
    const [map, setMap] = useState(null);
    const autocompleteRef = useRef(null); // Ref for Autocomplete
  
    const onLoad = useCallback((map) => {
      setMap(map);
    }, []);
  
    const onUnmount = useCallback(() => {
      setMap(null);
    }, []);
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    };
  
    const handleMapClick = (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    };
  
    const handlePlaceSelect = () => {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
  
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          address: place.formatted_address || "", // Update address field
        }));
  
        // Center the map on the selected location
        map.panTo({ lat, lng });
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const hospitalData = {
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          ouverture: new Date(`1970-01-01T${formData.ouverture}:00Z`),
          fermeture: new Date(`1970-01-01T${formData.fermeture}:00Z`),
        };
  
        await addHospital(hospitalData); // Call the service function
        alert("Hospital added successfully!");
        setFormData({
          name: "",
          address: "",
          ouverture: "",
          fermeture: "",
          inPromotion: false,
          latitude: center.lat,
          longitude: center.lng,
        }); // Reset the form
      } catch (error) {
        console.error("Error adding hospital: ", error);
        alert("Failed to add hospital.");
      }
    };
  
    return (
      <div>
        <h2>Add a New Hospital</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Address: </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Opening Time: </label>
            <input
              type="time"
              name="ouverture"
              value={formData.ouverture}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Closing Time: </label>
            <input
              type="time"
              name="fermeture"
              value={formData.fermeture}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>In Promotion: </label>
            <input
              type="checkbox"
              name="inPromotion"
              checked={formData.inPromotion}
              onChange={handleChange}
            />
          </div>
  
          {/* Autocomplete Input for Location Search */}
          <div>
            <label>Search Location: </label>
            {isLoaded && (
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceSelect}
              >
                <input
                  type="text"
                  placeholder="Search for a place"
                  style={{ width: "100%", padding: "10px" }}
                />
              </Autocomplete>
            )}
          </div>
  
          <div>
            <label>Latitude: </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              readOnly
            />
          </div>
          <div>
            <label>Longitude: </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              readOnly
            />
          </div>
  
          {/* Google Map Component */}
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: formData.latitude, lng: formData.longitude }}
              zoom={12}
              onClick={handleMapClick}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {/* Marker */}
              <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
            </GoogleMap>
          )}
  
          <button type="submit">Add Hospital</button>
        </form>
      </div>
    );
  };
  
  export default AddHospital;