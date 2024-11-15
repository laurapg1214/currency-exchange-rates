// generate base object for default base currency in dropdown
export const generateDefaultBase = (base) => {
  return {
    value: base.toLowerCase(),
    label: base,
    image: `/flags/square-flags/${base.toLowerCase()}.svg`
  };
}

// generate target object for default target currency in dropdown
export const generateDefaultTarget = (target) => {
  return {
    value: target.toLowerCase(),
    label: target,
    image: `/flags/square-flags/${target.toLowerCase()}.svg`
  };
}

// generate currencies array
// use of images with react-select adapted from https://stackoverflow.com/questions/45940726/populate-react-select-with-image
export const generateCurrencies = (rates) => {
  // generate array of currencies (excluding base)
  return Object.keys(rates).map((currencyCode) => {
      return {
      value: currencyCode.toLowerCase(),
      label: currencyCode,
      image: `/flags/square-flags/${currencyCode.toLowerCase()}.svg`
      };
  });
}