import { collection, addDoc, getDocs, GeoPoint,limit, startAfter ,query } from "firebase/firestore";
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
export const getHospitals = async (lastVisible) => {
  try {
    // const querySnapshot = await getDocs(hospitalsCollection);

    const querySnapshot = lastVisible
    ? await getDocs(query(hospitalsCollection, limit(10), startAfter(lastVisible)))
    : await getDocs(query(hospitalsCollection, limit(10)));


    const hospitals = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "Unknown Cabinet Name",  // Default if no name
        address: data.address || "No Address",  // Default if no address
        price: data.price || "Unknown Price",  // Default if no price
        reductionPrice: data.reductionPrice || null,  // Default if no reduction
        phone: data.phone || "No Phone",  // Default if no phone
        ouvertureDate: data.ouvertureDate || "No Opening Date",  // Opening Date
        ouvertureTime: data.ouvertureTime || "No Opening Time",  // Opening Time
        fermetureDate: data.fermetureDate || "No Closing Date",  // Closing Date
        fermetureTime: data.fermetureTime || "No Closing Time",  // Closing Time
        inPromotion: data.inPromotion || false,  // Promotion flag
        latitude: data.location?.latitude || null,  // Latitude from GeoPoint
        longitude: data.location?.longitude || null,  // Longitude from GeoPoint
      };
    });
    return hospitals;
  } catch (error) {
    console.error("Error fetching hospitals: ", error);
    throw error;
  }
};
