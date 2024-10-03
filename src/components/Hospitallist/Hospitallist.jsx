import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig.js"; // Firebase config

const HospitalList = ({ onHospitalsLoaded }) => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      const hospitalsCollection = collection(db, "hospitals");
      const hospitalSnapshot = await getDocs(hospitalsCollection);
      const hospitalList = hospitalSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HospitalList;
