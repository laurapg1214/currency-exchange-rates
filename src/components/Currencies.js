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
export const generateDefaultBase = (base) => {
// error handling
if (!base) {
  return;
}

// return base currency object
return {
  value: base.toLowerCase(),
  label: base,
  image: getFlagPath(base)
};
}

// generate target object for default target currency in dropdown
export const generateDefaultTarget = (target) => {
if (!target) {
  return;
}
return {
  value: target.toLowerCase(),
  label: target,
  image: getFlagPath(target)
};
}

// generate currencies array
// use of images with react-select adapted from https://stackoverflow.com/questions/45940726/populate-react-select-with-image
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


