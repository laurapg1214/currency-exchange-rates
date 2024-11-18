import React from 'react';
import Select from 'react-select';
import currencyToLocale from 'currency-to-locale'; // my package on npm
import 'bootstrap/dist/css/bootstrap.min.css';
import { json, checkStatus } from '../utils.js';
import { 
  generateDefaultBase, 
  generateDefaultTarget, 
  generateCurrencies 
} from './Currencies.js';

// container component 
export class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from: 'GBP',
      to: 'USD',
      amount: 1.0,
      fromAmount: null,
      fromAmtFormatted: '£1.00',
      fromAmtLabel: 'From Amount',
      toAmount: null,
      toAmtFormatted: '',
      toAmtLabel: 'To Amount',
      rates: null,
      error: '',
    };

    this.fetchRates = this.fetchRates.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleFromSelect = this.handleFromSelect.bind(this);
    this.handleToSelect = this.handleToSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.convert = this.convert.bind(this);
  }

  // fetch rates with current base
  fetchRates(from) {
    fetch(`https://api.frankfurter.app/latest?base=${from}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        // update state based on data from api
        this.setState({
          rates: data.rates,
          // reset error if successful
          error: ''
        });
      })
      // error handling
      .catch((error) => {
        this.setState({
          error: "Sorry, unable to fetch exchange rates. Please try again later.",
          // reset rates to null to avoid showing outdated data
          rates: null
        })
      });
  }
  
  // handler for amount input by user
  handleAmountChange(event) {
    const inputValue = parseFloat(event.target.value);

    // only update state if parsed input value is valid number
    if (!isNaN(inputValue)) {
      // update amount as user types
      this.setState({ amount: inputValue });
    } else {
      // handle invalid input
      alert('Please enter a number')
    }
    
  }

  // handler for base currency selected from dropdown
  handleFromSelect(selectedOption) {
    // update base currency from selection
    this.setState({ 
      from: selectedOption.label,
      // reset from label & values
      fromAmtLabel: `From Amount in ${selectedOption.label}`,
      fromAmtFormatted: '',
      toAmtFormatted: '',
    })
    // fetch rates with new base
    this.fetchRates(this.state.from)
  }

  // handler for target currency selected from dropdown
  handleToSelect(selectedOption) {
    // update target currency from selection
    this.setState({ 
      to: selectedOption.label,
      // reset to label & values
      fromAmtFormatted: '',
      toAmtLabel: `To Amount in ${selectedOption.label}`,
      toAmtFormatted: '',
    })
  }

  // submit event handler
  handleSubmit(event) {
    event.preventDefault();
    let { from, to, amount } = this.state;
    this.convert(from, to, amount);
  }

  // conversion function
  convert(from, to, amount) {
    // get locale IDs from currency codes
    const fromLocaleID = currencyToLocale(from);
    const toLocaleID = currencyToLocale(to);

    fetch(`https://api.frankfurter.app/latest?base=${from}&symbols=${to}`)
      .then((response) => response.json())
      .then((data) => {
        // create conversion value independent of state update for convertedAmt
        const calculatedToAmt = (
          // adapted from frankfurter.dev
          amount * data.rates[to]
        ).toFixed(2);

        // update state with conversion & formatted values
        this.setState ({
          fromAmtFormatted: (Intl.NumberFormat(
            fromLocaleID, 
            { style: "currency", currency: from }
          ).format(amount)),
          fromAmtLabel: `From Amount in ${from}`,
          toAmount: calculatedToAmt,
          toAmtFormatted: (Intl.NumberFormat(
            toLocaleID, 
            { style: "currency", currency: to }
          ).format(calculatedToAmt)),
          // show to amount label
          toAmtLabel: `To Amount in ${to}`,
          // reset error if successful
          error: '',
        }); 
      })
      // error handling
      .catch((error) => {
        console.error("Error fetching exchange rates:", error);
        this.setState({
          error: "Sorry, unable to fetch exchange rates. Please try again later."
        })
      });
  }

  componentDidMount() {
    // fetch current rates for dropdown lists
    this.fetchRates(this.state.from);

    // placeholder while rates loading
    if (!this.state.rates) {
      return <p>Loading rates...</p>
    }
  }
  
  render() {
    const { 
      from, 
      to, 
      amount,
      fromAmtFormatted,
      fromAmtLabel, 
      toAmtFormatted, 
      toAmtLabel,
      rates, 
      error 
    } = this.state;

    // if error, render error message in DOM
    if (error) {
      return (
        <div className='error-container'>
          <div className='error'>{error}</div>
        </div>
      )
    }

    // TODO: check if still need (this and below) generate default base object
    const defaultFrom = generateDefaultBase(from);

    // generate default target object
    const defaultTo = generateDefaultTarget(to);

    // generate currencies array
    const currencies = generateCurrencies(rates);

    // return Currency Converter table
    return (
      <div className="inner-container" id="currency-converter-container">
        <h3 className="text-center mb-4">Currency Converter</h3>
    
        {/* from currency dropdown */}
        <div className="dropdown-container">
          <div className="form-group">
            {/* htmlFor for accessibility */}
            <label htmlFor="from-currency" className="form-label">From</label>
            <Select
              className="currency-dropdown"
              // associate component with label htmlFor
              id="from-currency"
              // show base currency selection
              value={defaultFrom}
              // pass array of currency objects
              options={currencies}
              onChange={this.handleFromSelect}
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

          {/* switch arrow between currencies from 
          https://www.toptal.com/designers/htmlarrows/arrows/left-arrow-over-right-arrow/ */}
          <button className="switch-button">
            <span>&#8646;</span>
          </button>

          {/* target currency dropdown */}
          <div className="form-group">
            <label htmlFor="to-currency" className="form-label">To</label>
            <Select
              className="currency-dropdown"
              id="to-currency"
              // match current currency selection
              value={defaultTo} 
              // pass array of currency objects
              options={currencies}
              onChange={this.handleToSelect}
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
        </div>

        {/* amount input, submit button converted amount fields, wrapped in form element */}
        <form onSubmit={this.handleSubmit}>
          <div className="amount-container mt-4">
            <div className="form-group">
              <label htmlFor="amount" className="form-label">Amount to Convert
              </label>
              <input  
                type="text"
                id="amount-to-convert" 
                className="form-control" 
                value={ amount }
                onChange={this.handleAmountChange}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    this.handleSubmit(event);
                  }
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Convert
              </button>
            </div>
          </div>
        </form>
        
        {/* from amount */}
        <div id="from-amount">
          <label id="from-amt-label" htmlFor="from-amt">
              {fromAmtLabel}
          </label>
          
          <input 
            type="text" 
            id="from-amt-formatted"
            value={fromAmtFormatted} 
            readOnly
          />
        </div>

        {/* target amount (converted) */}
        <div id="to-amount">
          <label id="to-amt-label" htmlFor="to-amt">
              {toAmtLabel}
          </label> 
          
          <input 
            type="text" 
            id="to-amt-formatted"
            value={toAmtFormatted} 
            readOnly
          />
        </div>
      </div>
    )
  }
}

  
  
  
  