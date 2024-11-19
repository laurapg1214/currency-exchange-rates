import { json, checkStatus } from '../utils.js';

// generate flag image path
const getFlagPath = (code) => {
  // fallback image to handle no flag image
  if (code === 'ISK') {
    return '/flags/icons8-flag-24.png';
  }
  // dynamic path to flag images
  return `/flags/square-flags/${code.toLowerCase()}.svg`;
}

// generate base object for default base currency in dropdown
export const generateDefaultFrom = (from) => {
  // error handling
  if (!from) {
    return;
  }

  // return base currency object
  return {
    value: from.toLowerCase(),
    label: from,
    image: getFlagPath(from)
  };
}

// generate target object for default target currency in dropdown
export const generateDefaultTo = (to) => {
  if (!to) {
    return;
  }
  return {
    value: to.toLowerCase(),
    label: to,
    image: getFlagPath(to)
  };
}

export const generateCurrencies = (rates) => {
  // generate array of currencies (excluding base)
  if (!rates) {
    return;
  }
  return Object.keys(rates).map((currencyCode) => {
    // assign flag path var to handle no flag image
    
    return {
      value: currencyCode.toLowerCase(),
      label: currencyCode,
      image: getFlagPath(currencyCode)
    };
  });
}


