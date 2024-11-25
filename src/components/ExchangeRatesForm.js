import React from 'react';
import Select from 'react-select';
import { generateDefaultFrom } from '../utils/currencyUtils.js';

const ExchangeRatesForm = (props) => {
  // destructure props from state
  const { 
    base, 
    date, 
    currencies, 
    rates,
    error, 
  } = props.state;

  // if error, render error message in DOM
  if (error) {
    return (
      <p className="text-danger">{error}</p>
    )
  };

  // check rates object exists
  if (!rates) {
    return <p>Loading rates...</p>;
  };

  // create default base value for dropdown
  const defaultBase = generateDefaultFrom(base, currencies);

  // return Exchange Rates table
  return (
    <div className="inner-container" id="exchange-rates-container">
      <h3>Exchange Rates</h3>
      <h5>as of { date }</h5>

      {/* base currency select dropdown */}
      <div>
        <label id="base-currency-label" htmlFor="base-currency-dropdown">Base Currency</label>
        <Select
          id="base-currency-dropdown"
          // match current currency selection
          value={ defaultBase } 
          // pass array of currency objects
          options={ currencies }
          onChange={ props.handleBaseRateSelect }
          getOptionLabel={(currency) => (
            <div className="currency-option">
              <img 
                src={ currency.image } 
                alt={`${ currency.label } flag`} 
                style={{ width: 16, marginRight: 8 }}
              />
              <span>{ currency.value } ({ currency.label })</span>
            </div>
          )}
        /> 
      </div>

      {/* exchange rates table */}
      <table className='table'>
        <thead>
          <tr>
            <th>Currency</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {
            // loop through currencies array to create rows
            currencies && currencies.map((currency) => {
              //get rate for current currency
              const rate = rates[currency.label];

              // skip rendering if rate unavailable
              if (!rate) {
                return null;
              }
              
              return (
                <tr key={ currency.label }>
                  <td>
                    <img 
                      src={ currency.image }
                      alt={ `${ currency.label } flag`}
                      className="currency-flag"
                      style={{ width: 16, marginRight: 8 }}
                      />
                      { currency.value } ({ currency.label} )
                  </td>
                  <td>{ rate }</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default ExchangeRatesForm;