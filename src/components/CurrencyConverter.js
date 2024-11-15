import React, { useState } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import { json, checkStatus } from '../utils';
import { 
  generateDefaultBase, 
  generateDefaultTarget, 
  generateCurrencies 
} from './Currencies';

// container component (stateful)
export class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: 'EUR',
      target: 'USD',
      amount: 0.0,
      convertedAmount: 0.0,
      rates: null,
      error: '',
    };

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleBaseSelection = this.handleBaseSelection.bind(this);
    this.handleTargetSelection = this.handleTargetSelection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.convert = this.convert.bind(this);
  }

  // fetch rates with current base
  fetchRates(base) {
    fetch(`https://api.frankfurter.app/latest?base=${base}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        // update state based on data from api
        this.setState({
          rates: data.rates,
        });
      })
      // error handling
      .catch((error) => {
        this.setState({
          error: error.message || 'Error while fetching data',
          // reset rates to null to avoid showing outdated data
          rates: null
        })
      });
  }
  
  // listener for amount input by user
  handleAmountChange(event) {
    // update amount as user types
    this.setState({ amount: parseFloat(event.target.value) });
  }

  // listener for base currency selected from dropdown
  handleBaseSelection(selectedOption) {
    console.log("handling base selection");
    // update base currency from selection
    this.setState({ base: selectedOption.label })
    // fetch rates with new base
    this.fetchRates(this.state.base)
  }

  // listener for target currency selected from dropdown
  handleTargetSelection(selectedOption) {
    // update target currency from selection
    this.setState({ target: selectedOption.label })
  }

  // submit event handler
  handleSubmit(event) {
    event.preventDefault();
    let { base, target, amount } = this.state;
    this.convert(base, target, amount);
  }

  // conversion function adapted from frankfurter.dev 
  convert(base, target, amount) {
    // return if no amount selected
    if (amount <= 0) {
      alert('Please select an amount greater than 0 to convert');
      return;
    }

    // return if rates unavailable
    if (!this.state.rates || !this.state.rates[base] || !this.state.rates[target]) {
      alert('Rates not available.');
      return;
    }

    // convert using values of currency codes stored in from and to
    const conversionRate = this.state.rates[target] / this.state.rates[base]
    const convertedAmount = (amount * conversionRate).toFixed(2);

    // update convertedAmount state using shorthand (object key & variable name identical)
    this.setState({ convertedAmount });
  }

  componentDidMount() {
    // fetch current rates for dropdown lists
    this.fetchRates(this.state.base);

    // placeholder while rates loading
    if (!this.state.rates) {
      return <p>Loading rates...</p>
    }
  }
  
  render() {
    const { 
      base, 
      target, 
      amount, 
      convertedAmount, 
      rates, 
      error 
    } = this.state;

    // if error, render error message in DOM
    if (error) {
      return (
        <p className="text-danger">{error}</p>
      )
    }

    // generate default base object
    const defaultBase = generateDefaultBase(base);

    // generate default target object
    const defaultTarget = generateDefaultTarget(target);

    // generate currencies array
    const currencies = generateCurrencies(rates);

    // return Currency Converter table
    return (
      <div className="currency-selection">
        <h3 className="text-center mb-4">Currency Converter</h3>
    
        {/* base currency dropdown */}
        <div className="dropdown-container">
          <div className="form-group">
            <label htmlFor="base-currency" className="form-label">From</label>
            <Select
              // show base currency selection
              value={defaultBase}
              // pass array of currency objects
              options={currencies}
              onChange={this.handleBaseSelection}
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

          {/* double arrow between currencies from https://www.w3schools.com/charsets/ref_utf_arrows.asp */}
          <span className="arrow">&#8596;</span>

          {/* target currency dropdown */}
          <div className="form-group">
            <label htmlFor="target-currency" className="form-label">To</label>
            <Select
              // match current currency selection
              value={defaultTarget} 
              // pass array of currency objects
              options={currencies}
              onChange={this.handleTargetSelection}
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

        {/* amount input & converted amount fields */}
        <div className="amount-container mt-4">
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input 
              type="number" 
              id="amount" 
              className="form-control" 
              value={amount} 
              onChange={this.handleAmountChange}
            />
          </div>
          <div>
            <label htmlFor="convertedAmount">Converted Amount</label>
            <input 
              type="text" 
              id="convertedAmount" 
              value={convertedAmount} 
              readOnly
            />
          </div>
        </div>
      </div>
    )
  }
}

  
  
  
  