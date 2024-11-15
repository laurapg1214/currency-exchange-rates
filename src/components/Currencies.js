import React from 'react';

  // generate currencies array
  // use of images with react-select adapted from https://stackoverflow.com/questions/45940726/populate-react-select-with-image
  export const generateCurrencies = (rates) => {
    return Object.keys(rates).map((currencyCode) => {
        return {
        value: currencyCode.toLowerCase(),
        label: currencyCode,
        image: `/flags/square-flags/${currencyCode.toLowerCase()}.svg`
        };
    });
  }