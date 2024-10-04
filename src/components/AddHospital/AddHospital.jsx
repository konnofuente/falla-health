// src/components/AddHospital/AddHospital.jsx
import React, { useState } from "react";
import { addHospital } from "../../services/HospitalService.js"; // Import the service function

const AddHospital = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    ouverture: "",
    fermeture: "",
    inPromotion: false,
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
        latitude: "",
        longitude: "",
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
        <div>
          <label>Latitude: </label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
            step="any"
          />
        </div>
        <div>
          <label>Longitude: </label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
            step="any"
          />
        </div>
        <button type="submit">Add Hospital</button>
      </form>
    </div>
  );
};

export default AddHospital;
