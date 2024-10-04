import { collection, addDoc, getDocs, GeoPoint } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Collection reference for hospitals
const hospitalsCollection = collection(db, "hospitals");

/**
 * Add a new hospital to Firestore
 * @param {Object} hospital - Hospital object to be added
 * @returns {Promise} - Promise indicating success or failure
 */

export const addHospital = async (hospital) => {
  try {
    const newHospital = {
      ...hospital,
      location: new GeoPoint(hospital.latitude, hospital.longitude), // Convert lat/lng to GeoPoint
    };
    const docRef = await addDoc(hospitalsCollection, newHospital);
    console.log("Hospital added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding hospital: ", error);
    throw error;
  }
};

/**
 * Fetch all hospitals from Firestore
 * @returns {Promise} - Promise resolving with array of hospitals
 */
export const getHospitals = async () => {
  try {
    const querySnapshot = await getDocs(hospitalsCollection);
    const hospitals = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        address: data.address,
        price: data.price,
        // Convert Firestore timestamps to date strings
        ouverture: data.ouverture ? new Date(data.ouverture.seconds * 1000).toLocaleTimeString() : 'N/A',
        fermeture: data.fermeture ? new Date(data.fermeture.seconds * 1000).toLocaleTimeString() : 'N/A',
        inPromotion: data.inPromotion,
        latitude: data.location ? data.location.latitude : null,
        longitude: data.location ? data.location.longitude : null,
      };
    });
    return hospitals;
  } catch (error) {
    console.error("Error fetching hospitals: ", error);
    throw error;
  }
};
