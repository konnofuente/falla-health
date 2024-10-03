// src/components/HospitalList/HospitalList.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig.js";

const HospitalList = ({ onHospitalsLoaded }) => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      const hospitalsCollection = collection(db, "hospitals");
      const hospitalSnapshot = await getDocs(hospitalsCollection);
      const hospitalList = hospitalSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          address: data.address,
          // Convert Firestore timestamps to date strings
          ouverture: data.ouverture ? new Date(data.ouverture.seconds * 1000).toLocaleTimeString() : 'N/A',
          fermeture: data.fermeture ? new Date(data.fermeture.seconds * 1000).toLocaleTimeString() : 'N/A',
          inPromotion: data.inPromotion,
          latitude: data.location ? data.location.latitude : null,
          longitude: data.location ? data.location.longitude : null,
        };
      });
      setHospitals(hospitalList);
      onHospitalsLoaded(hospitalList);
    };

    fetchHospitals();
  }, [onHospitalsLoaded]);

  return (
    <div>
      <h2>Hospitals Offering Breast Cancer Screening</h2>
      <ul>
        {hospitals.map((hospital) => (
          <li key={hospital.id}>
            {hospital.name} - {hospital.address}
            <p>Open: {hospital.ouverture} - Close: {hospital.fermeture}</p>
            {hospital.inPromotion && <span>In Promotion</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HospitalList;
