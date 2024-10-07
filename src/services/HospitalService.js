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
    ? await getDocs(query(hospitalsCollection, limit(30), startAfter(lastVisible)))
    : await getDocs(query(hospitalsCollection, limit(30)));


    const hospitals = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",  // Default if no name
        address: data.address || "",  // Default if no address
        price: data.price || "",  // Default if no price
        reductionPrice: data.reductionPrice || null,  // Default if no reduction
        phone: data.phone || "",  // Default if no phone
        ouvertureDate: data.ouvertureDate || "",  // Opening Date
        ouvertureTime: data.ouvertureTime || "",  // Opening Time
        fermetureDate: data.fermetureDate || "",  // Closing Date
        fermetureTime: data.fermetureTime || "",  // Closing Time
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
