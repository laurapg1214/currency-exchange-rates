import React from 'react';
import ReactDOM from 'react-dom/client';
import getEmojiByCurrencyCode from "country-currency-emoji-flags";
import { json, checkStatus } from './utils';

const ExchangeRatesTable = ({ base, date, rates }) => {
  return (
    <div className="container">
      <h3>Exchange Rates</h3>
      <h4>as of {date}</h4>
      <h4>Base currency: {base}</h4>

      {/* currency rates table */}
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
              (from https://snyk.io/advisor/npm-package/country-currency-emoji-flags) */
              const flag = getEmojiByCurrencyCode(currencyCode);
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

class ExchangeRates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: '',
      date: '',
      rates: {},
      error: '',
    };
  }
  
  componentDidMount() {
    fetch(`https://api.frankfurter.app/latest`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        // update state based on data from the api
        this.setState({
          base: data.base,
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
          error: error.message || 'Error while fetching data'
        });
      });
  }
  
  render() {
    const { base, date, rates, error } = this.state;
    if (error) {
      return (
        <p className="text-danger">{error}</p>
      )
    }
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
  
  
  
  