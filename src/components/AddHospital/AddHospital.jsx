import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
  LoadScript,
} from "@react-google-maps/api";
import { addHospital } from "../../services/HospitalService.js"; // Import the service function
import "./AddHospital.css";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 3.848, // Default center (Yaoundé, Cameroon)
  lng: 11.5021,
};

const libraries = ["places"]; // Use only 'places' library

const AddHospital = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: null,
    ouvertureDate: "",
    ouvertureTime: "",
    fermetureDate: "",
    fermetureTime: "",
    inPromotion: false,
    latitude: 3.848,
    longitude: 11.5021,
    phone: "", // Add phone field
    price: "", // Add price field
    reductionPrice: "", // Add reduction price field
  });
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Use the correct API key, and make sure it's consistent
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY, // Use your real Google Maps API key

    libraries: libraries, // Ensure the library stays consistent
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

    console.log("this is the place" + place.formatted_address);
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
      // map.panTo({ lat, lng });
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

    // Check if the address field is empty
    if (!formData.address || formData.address.trim() === "") {
      alert("L'adresse ne doit pas être vide."); // Alert in French
      return; // Exit the function if address is empty
    }

    try {
      const ouvertureDateTime = getDateTime(
        formData.ouvertureDate,
        formData.ouvertureTime
      );
      const fermetureDateTime = getDateTime(
        formData.fermetureDate,
        formData.fermetureTime
      );

      let price = parseFloat(formData.price);
      let reductionPrice = formData.reductionPrice
        ? parseFloat(formData.reductionPrice)
        : null;

      const hospitalData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        ouverture: ouvertureDateTime,
        fermeture: fermetureDateTime,
        phone: `+237${formData.phone}`,
        price: price,
        reductionPrice: reductionPrice,
        inPromotion: reductionPrice > 0 && reductionPrice < price,
      };

      await addHospital(hospitalData);
      alert("Hôpital ajouté avec succès!"); // Success message in French
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
      alert("Échec de l'ajout de l'hôpital."); // Error message in French
    }
  };

  return (
    <div className="container">
      {/* Form Container */}
      <div className="form-container">
        <h2>Add a New Hospital</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom du cabinet/evenement: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="form-group">
                <label>Address: </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div> */}

          <div className="form-group">
            <label>Address: </label>
            {isLoaded && (
              <Autocomplete
                onLoad={(autocomplete) =>
                  (autocompleteRef.current = autocomplete)
                }
                onPlaceChanged={handlePlaceSelect}
                options={{
                  componentRestrictions: { country: "CM" }, // Restrict search to Cameroon
                }}
              >
                <input
                  type="text"
                  placeholder="recherche la place"
                  style={{ width: "100%", padding: "10px" }}
                />
              </Autocomplete>
            )}
          </div>
          <div className="form-group">
            <label>Numero Telephone: </label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  padding: "10px",
                  background: "#f0f0f0",
                  border: "1px solid #ccc",
                }}
              >
                +237
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="group">
              <div>
                <label>Entrez la date de début </label>
                <input
                  type="date"
                  name="ouvertureDate"
                  value={formData.ouvertureDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Entrez la date de fin </label>
                <input
                  type="date"
                  name="fermetureDate"
                  value={formData.fermetureDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-group"></div>
          <div className="form-group">
            <label>Heure d'ouverture :</label>
            <input
              type="time"
              name="ouvertureTime"
              value={formData.ouvertureTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Heure de fermeture :</label>
            <input
              type="time"
              name="fermetureTime"
              value={formData.fermetureTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Prix Normal: </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Prix Reduction : </label>
            <input
              type="number"
              name="reductionPrice"
              value={formData.reductionPrice}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-button">
            Add Hospital
          </button>
        </form>
      </div>

      {/* Map Container */}
      {/* <div className="map-container">
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
          </div> */}
    </div>
  );
};

export default AddHospital;
