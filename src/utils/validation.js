// Input validation and sanitization utilities

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 500); // Limit length
};

/**
 * Validate hospital name
 * @param {string} name - Hospital name
 * @returns {object} - Validation result
 */
export const validateHospitalName = (name) => {
  const sanitized = sanitizeString(name);
  
  if (!sanitized || sanitized.length < 2) {
    return { isValid: false, error: 'Le nom doit contenir au moins 2 caractères' };
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, error: 'Le nom ne peut pas dépasser 100 caractères' };
  }
  
  return { isValid: true, value: sanitized };
};

/**
 * Validate phone number (Cameroon format)
 * @param {string} phone - Phone number
 * @returns {object} - Validation result
 */
export const validatePhoneNumber = (phone) => {
  const sanitized = sanitizeString(phone);
  
  // Remove all non-digit characters
  const digitsOnly = sanitized.replace(/\D/g, '');
  
  // Cameroon phone numbers should be 9 digits (without country code)
  if (digitsOnly.length !== 9) {
    return { isValid: false, error: 'Le numéro doit contenir 9 chiffres' };
  }
  
  // Check if it starts with valid Cameroon prefixes
  const validPrefixes = ['6', '2', '3', '4', '5', '7'];
  if (!validPrefixes.includes(digitsOnly[0])) {
    return { isValid: false, error: 'Numéro de téléphone invalide pour le Cameroun' };
  }
  
  return { isValid: true, value: digitsOnly };
};

/**
 * Validate coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {object} - Validation result
 */
export const validateCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  // Cameroon coordinates bounds (approximate)
  const CAMEROON_BOUNDS = {
    north: 13.0,
    south: 1.0,
    east: 16.0,
    west: 8.0
  };
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return { isValid: false, error: 'Coordonnées invalides' };
  }
  
  if (latitude < CAMEROON_BOUNDS.south || latitude > CAMEROON_BOUNDS.north ||
      longitude < CAMEROON_BOUNDS.west || longitude > CAMEROON_BOUNDS.east) {
    return { isValid: false, error: 'Les coordonnées doivent être au Cameroun' };
  }
  
  return { isValid: true, value: { latitude, longitude } };
};

/**
 * Validate price
 * @param {string|number} price - Price value
 * @returns {object} - Validation result
 */
export const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  
  if (isNaN(numPrice)) {
    return { isValid: false, error: 'Prix invalide' };
  }
  
  if (numPrice < 0) {
    return { isValid: false, error: 'Le prix ne peut pas être négatif' };
  }
  
  if (numPrice > 1000000) {
    return { isValid: false, error: 'Le prix semble trop élevé' };
  }
  
  return { isValid: true, value: numPrice };
};

/**
 * Validate date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {object} - Validation result
 */
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Dates invalides' };
  }
  
  if (start > end) {
    return { isValid: false, error: 'La date de début doit être antérieure à la date de fin' };
  }
  
  if (end < now) {
    return { isValid: false, error: 'La date de fin ne peut pas être dans le passé' };
  }
  
  return { isValid: true, value: { startDate: start, endDate: end } };
};

/**
 * Validate complete hospital data
 * @param {object} hospitalData - Hospital data object
 * @returns {object} - Validation result
 */
export const validateHospitalData = (hospitalData) => {
  const errors = [];
  const validatedData = {};
  
  // Validate name
  const nameValidation = validateHospitalName(hospitalData.name);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.error);
  } else {
    validatedData.name = nameValidation.value;
  }
  
  // Validate address
  const address = sanitizeString(hospitalData.address);
  if (!address || address.length < 10) {
    errors.push('L\'adresse doit contenir au moins 10 caractères');
  } else {
    validatedData.address = address;
  }
  
  // Validate phone
  if (hospitalData.phone) {
    const phoneValidation = validatePhoneNumber(hospitalData.phone);
    if (!phoneValidation.isValid) {
      errors.push(phoneValidation.error);
    } else {
      validatedData.phone = `+237${phoneValidation.value}`;
    }
  }
  
  // Validate coordinates
  const coordValidation = validateCoordinates(hospitalData.latitude, hospitalData.longitude);
  if (!coordValidation.isValid) {
    errors.push(coordValidation.error);
  } else {
    validatedData.latitude = coordValidation.value.latitude;
    validatedData.longitude = coordValidation.value.longitude;
  }
  
  // Validate prices
  if (hospitalData.price) {
    const priceValidation = validatePrice(hospitalData.price);
    if (!priceValidation.isValid) {
      errors.push(priceValidation.error);
    } else {
      validatedData.price = priceValidation.value;
    }
  }
  
  if (hospitalData.reductionPrice) {
    const reductionValidation = validatePrice(hospitalData.reductionPrice);
    if (!reductionValidation.isValid) {
      errors.push(reductionValidation.error);
    } else {
      validatedData.reductionPrice = reductionValidation.value;
    }
  }
  
  // Validate date range
  if (hospitalData.ouvertureDate && hospitalData.fermetureDate) {
    const dateValidation = validateDateRange(hospitalData.ouvertureDate, hospitalData.fermetureDate);
    if (!dateValidation.isValid) {
      errors.push(dateValidation.error);
    } else {
      validatedData.ouvertureDate = hospitalData.ouvertureDate;
      validatedData.fermetureDate = hospitalData.fermetureDate;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: validatedData
  };
};
