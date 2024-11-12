import React from 'react';
import ReactDOM from 'react-dom/client';
import getEmojiByCurrencyCode from 'country-currency-emoji-flags';
import { json, checkStatus } from './utils';

// rendered UI - presentational component (stateless)
const ExchangeRatesTable = (props) => {
  // object destructuring: pull properties out of props object returned by api call
  const { base, date, rates } = props;

  // check rates object exists
  if (!rates) {
    return <p>No rates data available.</p>;
  }
  
  // return Exchange Rates table
  return (
    <div className="container">
      <h3>Exchange Rates</h3>
      <h4>as of {date}</h4>
      <h4>Base currency: {base}</h4>
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
              (from https://snyk.io/advisor/npm-package/country-currency-emoji-flags) 
              default to globe if no flag */
              const flag = getEmojiByCurrencyCode(currencyCode) || '🌍';
              const rate = rates[currencyCode]
              return (
                <tr key={ currencyCode }>
                  <td>{ flag }</td>
                  <td>{ currencyCode }</td>
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
class ExchangeRates extends React.Component {
  // object constructor
  constructor(props) {
    super(props);
    this.state = {
      base: 'EUR',
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
  handleBaseRateSelect(event) {
    // update base currency & baseURL from selection
    this.setState(
      { 
        base: event.target.value,
        baseURL: `https://api.frankfurter.app/latest?base=${event.target.value}`
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
        <ExchangeRatesTable base={base} date={date} rates={rates} />
      </div>
    )
  }
}
  
  const container = document.getElementById('root');
  const root = ReactDOM.createRoot(container);
  root.render(<ExchangeRates />);
  
  
  
  