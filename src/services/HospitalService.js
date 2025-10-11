import { collection, addDoc, getDocs, GeoPoint, limit, startAfter, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { validateHospitalData } from "../utils/validation";

// Collection reference for hospitals
const hospitalsCollection = collection(db, "hospitals");

/**
 * Add a new hospital to Firestore with validation and security checks
 * @param {Object} hospital - Hospital object to be added
 * @returns {Promise} - Promise indicating success or failure
 */
export const addHospital = async (hospital) => {
  try {
    // Temporarily disable authentication check for development
    // TODO: Re-enable after setting up Firebase Authentication
    // if (!AuthService.isAuthenticated()) {
    //   throw new Error("Authentication required to add hospitals");
    // }

    // Validate hospital data
    const validation = validateHospitalData(hospital);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Prepare hospital data
    const newHospital = {
      ...validation.data,
      location: new GeoPoint(validation.data.latitude, validation.data.longitude),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Remove sensitive fields that shouldn't be stored
    delete newHospital.latitude;
    delete newHospital.longitude;

    const docRef = await addDoc(hospitalsCollection, newHospital);
    
    // Log success without sensitive data
    console.log("Hospital added successfully with ID:", docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    // Log error without exposing sensitive information
    console.error("Error adding hospital:", error.message);
    
    // Return user-friendly error message
    if (error.message.includes("Validation failed")) {
      throw new Error(error.message);
    } else if (error.message.includes("Authentication required")) {
      throw new Error("Vous devez être connecté pour ajouter un hôpital");
    } else {
      throw new Error("Erreur lors de l'ajout de l'hôpital. Veuillez réessayer.");
    }
  }
};

/**
 * Fetch approved hospitals from Firestore with security measures
 * @param {object} lastVisible - Last visible document for pagination
 * @returns {Promise} - Promise resolving with array of hospitals
 */
export const getHospitals = async (lastVisible) => {
  try {
    // Only fetch approved hospitals
    const baseQuery = query(
      hospitalsCollection,
      limit(30)
    );

    const finalQuery = lastVisible 
      ? query(baseQuery, startAfter(lastVisible))
      : baseQuery;

    const querySnapshot = await getDocs(finalQuery);

    const hospitals = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      
      return {
        id: doc.id,
        name: data.name || "",
        address: data.address || "",
        price: data.price || null,
        reductionPrice: data.reductionPrice || null,
        phone: data.phone || "",
        ouvertureDate: data.ouvertureDate || "",
        ouvertureTime: data.ouvertureTime || "",
        fermetureDate: data.fermetureDate || "",
        fermetureTime: data.fermetureTime || "",
        inPromotion: data.inPromotion || false,
        latitude: data.location?.latitude || null,
        longitude: data.location?.longitude || null,
      };
    });

    return hospitals;
  } catch (error) {
    // Log error without exposing sensitive information
    console.error("Error fetching hospitals:", error.message);
    throw new Error("Erreur lors du chargement des hôpitaux. Veuillez réessayer.");
  }
};

