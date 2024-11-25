import { 
  checkStatus,
  json,
} from './fetchUtils.js';

// generate flag image path
const generateFlagPath = (code) => {
  // fallback image to handle no flag image
  if (code === 'ISK') {
    return `${process.env.PUBLIC_URL}/flags/icons8-flag-24.png`;
  }
  /* dynamic path to flag images
  (from https://www.npmjs.com/package/currency-flags) */
  return `${process.env.PUBLIC_URL}/flags/square-flags/${code.toLowerCase()}.svg`;
}
  
export const getCurrencies = () => {
// generate array of all currencies
  return fetch('https://api.frankfurter.app/currencies')
    .then(checkStatus)
    .then(json)
    .then((data) => {
    // create array of currencies with flag images
      return Object.entries(data).map(([currencyCode, currencyName]) => {
        return {
        value: currencyName,
        label: currencyCode,
        image: generateFlagPath(currencyCode) // assign flag path var to handle no flag image
        };
      });
    })
    .catch((error) => {
    // return rejected promise for catch block handling in components
    return Promise.reject(error);
    })
}

// fetch rates with current base
export const getRates = (base) => {
  return fetch(`https://api.frankfurter.app/latest?base=${base}`)
    .then(checkStatus)
    .then(json)
    .then((data) => {
    // return rates object for updating rates state in components
      return data.rates;
    })
    // error handling
    .catch((error) => {
    // return rejected promise for catch block handling in components
      return Promise.reject(error);
    });
}

// generate base object for default base currency in dropdown
export const generateDefaultFrom = (from, currencies) => {
// error handling
  if (!from || !currencies) {
    return;
  }

  // find currencies object in currencies array matching from (as base)
  const currencyName = currencies.find(c => c.label === from);

  // return base currency object
  return {
    value: currencyName ? currencyName.value : '',
    label: from,
    image: generateFlagPath(from)
  };
}

// generate quote currency object for default quote currency in dropdown
export const generateDefaultTo = (to) => {
  if (!to) {
    return;
  }
  return {
    value: to.toLowerCase(),
    label: to,
    image: generateFlagPath(to)
  };
}
