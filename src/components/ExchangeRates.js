import React from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { 
  fetchRates,
  fetchCurrencies,
  generateDefaultFrom,
} from './Currencies.js';

// container component (stateful)
export class ExchangeRates extends React.Component {
  // object constructor
  constructor(props) {
    super(props);
    this.state = {
      base: 'EUR',
      date: format(new Date(), 'd MMMM yyyy'),
      currencies: null,
      rates: null,
      error: '',
    };

    this.handleBaseRateSelect = this.handleBaseRateSelect.bind(this);
  }

  // listener for base rate selection
  // selectedOption passed in instead of event bc using React Select

  // TODO: make rates refresh
  handleBaseRateSelect(selectedOption) {
    // update base currency & baseURL from selection
    this.setState({ base: selectedOption.label }, () => {
      // fetchRates passed as callback function after base state update
      fetchRates(this.state.base)
        .then((newRates) => {
          this.setState({ rates: newRates });
        });
      });
  }

  componentDidMount() {
    // fetch full list of currencies and flags
    fetchCurrencies()
      .then((currencies) => {
        this.setState({
          currencies,
          // reset error state if successful
          error:'',
        });
      })
      .catch((error) => {
        this.setState({ error: error.message || error });
      });

    // fetch rates using current base (from)
    fetchRates(this.state.base)
      .then((rates) => {
        this.setState ({
          rates,
          error: '',
        })
      })
      .catch((error) => {
        this.setState({
          // reset rates to avoid showing outdated data
          rates: null,
          error: error.message || error,
        })
      })
  }

  render() {
    const { 
      base, 
      date, 
      currencies, 
      rates,
      error, 
    } = this.state;

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
          <label htmlFor="base-rate">Base Currency</label>
          <Select
            className="base-rate-dropdown"
            id="base-rate"
            // match current currency selection
            value={ defaultBase } 
            // pass array of currency objects
            options={ currencies }
            onChange={ this.handleBaseRateSelect }
            getOptionLabel={(currency) => (
              <div className="currency-option">
                <img 
                  src={currency.image} 
                  alt={`${currency.label} flag`} 
                  style={{ width: 16, marginRight: 8 }}
                />
                <span>{currency.value} ({currency.label})</span>
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
}
    
  
  