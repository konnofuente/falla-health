import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { addHospital } from "../../services/HospitalService.js"; // Import the service function
import'./AddHospital.css'

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
        ouvertureDate: "",
        ouvertureTime: "",
        fermetureDate: "",
        fermetureTime: "",
        inPromotion: false,
        latitude: 3.8480,
        longitude: 11.5021,
        phone: "",           // Add phone field
        price: "",           // Add price field
        reductionPrice: "",  // Add reduction price field
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
  
    const getDateTime = (date, time) => {
      if (!date || !time) {
        return null; // Return null if date or time is falsy
      }
      return new Date(`${date}T${time}:00`);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
   
   const ouvertureDateTime = getDateTime(formData.ouvertureDate, formData.ouvertureTime);
   const fermetureDateTime = getDateTime(formData.fermetureDate, formData.fermetureTime);
   
   // You may want to handle `null` case for ouvertureDateTime and fermetureDateTime later in your code.
   
          const hospitalData = {
            ...formData,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            ouverture: ouvertureDateTime,
            fermeture: fermetureDateTime,
            phone: formData.phone,
            price: parseFloat(formData.price),
            reductionPrice: formData.reductionPrice ? parseFloat(formData.reductionPrice) : null,
          };
      
          await addHospital(hospitalData);
          alert("Hospital added successfully!");
          setFormData({
            name: "",
            address: "",
            ouvertureDate: "",
            ouvertureTime: "",
            fermetureDate: "",
            fermetureTime: "",
            inPromotion: false,
            latitude: center.lat,
            longitude: center.lng,
            phone: "",           
            price: "",           
            reductionPrice: "",  
          }); // Reset the form
        } catch (error) {
          console.error("Error adding hospital: ", error);
          alert("Failed to add hospital.");
        }
      };
      
  
      return (
        <div className="container">
          {/* Form Container */}
          <div className="form-container">
            <h2>Add a New Hospital</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name: </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address: </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
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
        
        <div className="form-group">
          <label>Latitude: </label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            readOnly
          />
        </div>
        
        <div className="form-group">
          <label>Longitude: </label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            readOnly
          />
        </div>
        
              <div className="form-group">
                <label>Opening Date and Time: </label>
                <input
                  type="date"
                  name="ouvertureDate"
                  value={formData.ouvertureDate}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  name="ouvertureTime"
                  value={formData.ouvertureTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Closing Date and Time: </label>
                <input
                  type="date"
                  name="fermetureDate"
                  value={formData.fermetureDate}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  name="fermetureTime"
                  value={formData.fermetureTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number: </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              
              <div className="form-group">
                <label>Price: </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reduction Price: </label>
                <input
                  type="number"
                  name="reductionPrice"
                  value={formData.reductionPrice}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="submit-button">Add Hospital</button>
            </form>
          </div>
      
          {/* Map Container */}
          <div className="map-container">
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onClick={handleMapClick}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
                <Autocomplete
                  onLoad={(ref) => (autocompleteRef.current = ref)}
                  onPlaceChanged={handlePlaceSelect}
                >
                  <input type="text" placeholder="Search for location..." />
                </Autocomplete>
              </GoogleMap>
            )}
          </div>
        </div>
      );
      
  };
  
  export default AddHospital;