import React from 'react';
import Select from 'react-select';
import { getEmojiByCurrencyCode } from 'country-currency-emoji-flags';
import { json, checkStatus } from '../utils';

// rendered UI - presentational component (stateless)
const ExchangeRatesTable = (props) => {
  // object destructuring: pull properties out of props object returned by api call
  const { base, date, rates, handleBaseRateSelect } = props;
  console.log(rates);

  // check rates object exists
  if (!rates) {
    return <p>Loading rates...</p>;
  }

  // create currencies array
  // use of images with react-select adapted from https://stackoverflow.com/questions/45940726/populate-react-select-with-image
  const currencies = Object.keys(rates).map((currencyCode) => {
    return {
      value: currencyCode.toLowerCase(),
      label: currencyCode,
      image: `/flags/square-flags/${currencyCode.toLowerCase()}.svg`
    };
  });

  // create default base value for dropdown
  const defaultBase = currencies.find(currency => currency.label === base.toLowerCase());
  console.log(defaultBase);
  
  // return Exchange Rates table
  return (
    <div className="container">
      <h3>Exchange Rates</h3>
      <h4>as of {date}</h4>

      {/* base rate select dropdown */}
      <div>
        <label htmlFor="base-rate" className="form-label">Base Rate</label>
        <Select
          // match current currency selection
          value={defaultBase} 
          // pass array of currency objects
          options={currencies}
          onChange={handleBaseRateSelect}
          getOptionLabel={(currency) => (
            <div className="currency-option">
              <img 
                src={currency.image} 
                alt={`${currency.label} flag`} 
                style={{ width: 16, marginRight: 8 }}
              />
              <span>{currency.label}</span>
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
            /* loop through rates object to create rows */
            Object.keys(rates).map((currencyCode) => {
              /* get flag emojis 
              (from https://www.npmjs.com/package/currency-flags) */
              const rate = rates[currencyCode]
              const flagSrc = `/flags/square-flags/${currencyCode.toLowerCase()}.svg`; 

              return (
                <tr key={ currencyCode }>
                  <td>
                    <img 
                      alt={`${currencyCode} flag`}
                      src={flagSrc}
                      className={`currency-flag currency-flag-${currencyCode}`} 
                      style={{ width: 16, marginRight: 8 }}
                      />
                      { currencyCode }
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

// container component (stateful)
export class ExchangeRates extends React.Component {
  // object constructor
  constructor(props) {
    super(props);
    this.state = {
      base: '',
      date: '',
      rates: null,
      baseURL: `https://api.frankfurter.app/latest`,
      error: '',
    };

    this.apiCall = this.apiCall.bind(this);
    this.handleBaseRateSelect = this.handleBaseRateSelect.bind(this);
  }

  // api call (defined below)
  componentDidMount() {
    this.apiCall();
  }

  // able to be rerun with updated baseURL
  apiCall() {
    fetch(this.state.baseURL)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        // update state based on data from api
        this.setState({
          date: data.date,
          rates: data.rates,
          // reset error if successful
          error:''
        })
      })
      // error handling: catch block
      // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
      .catch((error) => {
        this.setState({
          error: error.message || 'Error while fetching data',
          // reset rates to null to avoid showing outdated data
          rates: null
        });
      });
  }

  // listener for base rate selection
  // selectedOption passed in instead of event bc using React Select
  handleBaseRateSelect(selectedOption) {
    // update base currency & baseURL from selection
    this.setState(
      { 
        base: selectedOption.value,
        baseURL: `https://api.frankfurter.app/latest?base=${selectedOption.value}`
      }, 
      // apiCall passed as callback function
      this.apiCall
    );
  }

  // render statement
  render() {
    const { base, date, rates, error } = this.state;
    // if error, render error message in DOM
    if (error) {
      return (
        <p className="text-danger">{error}</p>
      )
    }
    // call child component ExchangeRatesTable for rendering in DOM
    return (
      <div className="container">
        <ExchangeRatesTable 
          base={base} 
          date={date} 
          rates={rates} 
          handleBaseRateSelect={this.handleBaseRateSelect}
        />
      </div>
    )
  }
}

  
  
  
  