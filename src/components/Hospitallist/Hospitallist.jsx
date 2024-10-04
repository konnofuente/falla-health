// src/components/HospitalList/HospitalList.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import { getHospitals } from "../../services/HospitalService.js";

const HospitalList = ({ onHospitalsLoaded }) => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      // const hospitalsCollection = collection(db, "hospitals");
      // const hospitalSnapshot = await getDocs(hospitalsCollection);
      const hospitalList = await getHospitals();
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
