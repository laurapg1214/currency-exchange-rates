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

export const fetchCurrencies = () => {
  // generate array of all currencies
  return fetch('https://api.frankfurter.app/currencies')
    .then(checkStatus)
    .then(json)
    .then((data) => {
      // create array of currencies with flag images
      return Object.keys(data).map((currencyCode) => {
        return {
          value: currencyCode.toLowerCase(),
          label: currencyCode,
          image: getFlagPath(currencyCode) // assign flag path var to handle no flag image
        };
      });
    })
    .catch((error) => {
      // return rejected promise for catch block handling in components
      return Promise.reject(error);
    })
}

// fetch rates with current base
export const fetchRates = (base) => {
  return fetch(`https://api.frankfurter.app/latest?base=${base}`)
    .then(checkStatus)
    .then(json)
    .then((data) => {
      // return rates object for updating rates state in components
      return data.rates;
      }
    )
    // error handling
    .catch((error) => {
      // return rejected promise for catch block handling in components
      return Promise.reject(error);
    });
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
