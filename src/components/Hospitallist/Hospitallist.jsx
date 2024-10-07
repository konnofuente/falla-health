import React, { useState, useEffect } from "react";
import { getHospitals } from "../../services/HospitalService.js";
import "./Hospitallist.css"; 
import { Sheet, SheetRef } from 'react-modal-sheet';

const HospitalList = ({ onHospitalsLoaded, currentLocation }) => {
  const [hospitals, setHospitals] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [isOpen, setIsOpen] = useState(true); // Control for modal sheet
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
  
    const fetchHospitals = async () => {
      try {
        const hospitalList = await getHospitals();
  
        // Sort hospitals based on their distance from the currentLocation
        const sortedHospitals = hospitalList.map((hospital) => {
          const distance = calculateDistance({
            latitude: hospital.latitude,
            longitude: hospital.longitude
          });
          return {...hospital, distance};
        }).sort((a, b) => a.distance - b.distance); // Sort by ascending distance
  
        setHospitals(sortedHospitals);
        onHospitalsLoaded(sortedHospitals);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setHospitals([]); // Set to empty array or handle differently based on your UI needs
      }
    };
  
    fetchHospitals();
  }, []); 



  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        if (currentLocation) {
          const { lat, lng } = currentLocation;
  
          // Ensure API_KEY is correctly defined and securely stored
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch address'); // Throws an error if response is not ok
          }
  
          const data = await response.json();
  
          if (data.results && data.results.length > 0) {
            setUserAddress(data.results[0].formatted_address);
          } else {
            setUserAddress("Unknown location");
          }
        }
      } catch (error) {
        console.error('Error fetching user address:', error);
        setUserAddress("Failed to determine location"); // Set error message or handle differently 
      }
    };
  
    fetchUserAddress();
  }, []); 


  const calculateDistance = (hospitalLocation) => {
    if (!hospitalLocation || !hospitalLocation.latitude || !hospitalLocation.longitude) {
      return "N/A";
    }

    const { latitude, longitude } = hospitalLocation;
    const R = 6371; 
    const dLat = (latitude - currentLocation.lat) * (Math.PI / 180);
    const dLon = (longitude - currentLocation.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(currentLocation.lat * (Math.PI / 180)) *
        Math.cos(latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  // Event handler for share button click
  const handleShare = (hospital) => {
    const shareUrl = `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`;
    
    // Check if the browser supports the native share API
    if (navigator.share) {
      navigator.share({
        title: `Découvrez ${hospital.name}`,
        text: `Hello, j'espère que tu vas bien ! Je viens de découvrir que l'hôpital ${hospital.name} propose des dépistages du sein contre le cancer, et je voulais te partager cette info. Je l'ai trouvé sur le site FallaCare de CamaireTech: https://fallacare.camairetech.com/ Visite le site pour trouver un autre hôpital plus proche de chez toi !`,
        url: shareUrl,
      })
      
    
      .then(() => console.log("Sharing successful"))
      .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for browsers that do not support navigator.share
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert("Le lien de l'hôpital a été copié dans le presse-papiers !"))
        .catch((error) => console.error("Error copying link:", error));
    }
  };
  return (
    <>
{isOpen ? null : 
  <button onClick={() => setIsOpen(true)} className="open-sheet-button">
    Show Nearby Hospitals
  </button>
}

  

      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        snapPoints={[650, 300, 100]}
        initialSnap={0}
        disableDrag={false}
      >
        <Sheet.Container>
          <Sheet.Header />
         <Sheet.Content>
           <div className="hospital-list">
             <h2>Hôpitaux proposant le dépistage du cancer du sein</h2>
         
             <ul>
               {hospitals.map((hospital) => (
                 <li key={hospital.id} className="hospital-item">
                   {hospital.inPromotion && (
                     <span className="promotion-tag">En Promotion</span>
                   )}
                   <div className="hospital-header">
                     <h3 className="hospital-name">{hospital.name || hospital.address}</h3>
                     
                     <p className="hospital-distance">
                       {calculateDistance(hospital)} km de vous
                     </p>
                   </div>
                   <div className="hospital-details">
                     <p className="hospital-address">{hospital.address}</p>
     
     <p>
       <span className="open">
         {hospital.ouvertureDate ? `Du ${hospital.ouvertureDate} au ${hospital.fermetureDate || "date de fermeture inconnue"}` : "Période d'ouverture non disponible"}
       </span> <br></br>
       {hospital.ouvertureTime && 
         <span className="close">
           <span className="open-label">Heure :</span> {`De ${hospital.ouvertureTime} à ${hospital.fermetureTime || "heure de fermeture inconnue"}`}
         </span>
       }
     </p>
     
             
                 
                    
                     {hospital.phone && (
                       <p className="hospital-phone">Téléphone : {hospital.phone}</p>
                     )}
                     {hospital.price ? (
                       <p className="hospital-price">
                         Prix: <s>{hospital.price} FCFA</s>
                         {hospital.reductionPrice && (
                           <span className="reduction-price">
                             {" "}
                             Prix réduit : {hospital.reductionPrice} FCFA
                           </span>
                         )}
                       </p>
                     ) : (
                       <p className="hospital-price">Veuillez visiter ou appeler pour connaître les prix.</p>
                     )}
                   </div>
                   <div className="hospital-actions">
                   <button 
                     className="btn-call"
                     onClick={() => window.location.href = `tel:${hospital.phone}`}
                     disabled={!hospital.phone}  // This disables the button if hospital.phone is empty
                   >
                     Appeler
                   </button>
                   
                     <button
                       onClick={() => handleShare(hospital)}
                       className="btn-share"
                     >
                       Partager
                     </button>
                   </div>
                 </li>
               ))}
             </ul>
         
           </div>
         </Sheet.Content>
         
        </Sheet.Container>
      </Sheet>
    </>
  );
};

export default HospitalList;