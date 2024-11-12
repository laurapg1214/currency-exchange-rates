import React from 'react';
import ReactDOM from 'react-dom/client';
import { getEmojiByCurrencyCode } from 'country-currency-emoji-flags';
import 'bootstrap/dist/css/bootstrap.min.css';
import { json, checkStatus } from './utils';

// rendered UI - presentational component (stateless)
const CurrencyConverterTable = (props) => {
  // props object destructuring 
  const { 
    from, 
    to, 
    amount, 
    convertedAmount, 
    rates,
    handleAmountChange,
    handleFromSelection,
    handleToSelection
  } = props;

  if (!rates) {
    return <p>Loading rates...</p>
  }

  // return Currency Converter table
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h3 className="text-center mb-4">Currency Converter</h3>

      {/* base currency dropdown */}
      <div className="form-group">
        <label htmlFor="baseCurrency" className="form-label">Base Currency</label>
        <select 
          id="baseCurrency" 
          className="form-select" 
          value={from}
          onChange={handleFromSelection}
        >
          {
            Object.keys(rates).map((currencyCode) => {
              /* get flag emojis
              (from https://snyk.io/advisor/npm-package/country-currency-emoji-flags) 
              default to globe if no flag */
              const flag = getEmojiByCurrencyCode(currencyCode) || '🌍';
              return (
                // key for React rendering, value as what's submitted/used when user selects
                <option key={currencyCode} value={currencyCode}>
                  {/* render flag emoji with currency code */}
                  {flag} {currencyCode}
                </option>
              );
            })
          }
        </select>
      </div>

      {/* double arrow between currencies from https://www.w3schools.com/charsets/ref_utf_arrows.asp */}
      <span className="arrow">&#8596;</span>

      {/* target currency dropdown */}
      <div className="form-group">
        <label htmlFor="target-currency" className="form-label">Target Currency</label>
        <select 
          id="targetCurrency" 
          className="form-select" 
          value={to}
          onChange={handleToSelection}
        >
          {
            Object.keys(rates).map((currencyCode) => {
              /* get flag emojis
              (from https://snyk.io/advisor/npm-package/country-currency-emoji-flags) */
              const flag = getEmojiByCurrencyCode(currencyCode);
              return (
                <option key={currencyCode} value={currencyCode}>
                  {/* render flag emoji with currency code */}
                  {flag} {currencyCode}
                </option>
              );
            })
          }
        </select>
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
            onChange={handleAmountChange}
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

// container component (stateful)
export class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from: 'EUR',
      to: 'USD',
      amount: 0.0,
      convertedAmount: 0.0,
      rates: null,
      error: '',
    };

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleFromSelection = this.handleFromSelection.bind(this);
    this.handleToSelection = this.handleToSelection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.convert = this.convert.bind(this);
  }

  componentDidMount() {
    // fetch current rates for dropdown lists
    fetch(`https://api.frankfurter.app/latest?base=EUR`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        // update state based on data from api
        this.setState({
          rates: data.rates
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
  handleFromSelection(event) {
    // update base currency from selection
    this.setState({ from: event.target.value })
  }
  // listener for target currency selected from dropdown
  handleToSelection(event) {
    // update target currency from selection
    this.setState({ to: event.target.value })
  }

  // submit event handler
  handleSubmit(event) {
    event.preventDefault();
    let { from, to, amount } = this.state;
    this.convert(from, to, amount);
  }

  // conversion function adapted from frankfurter.dev 
  convert(from, to, amount) {
    // return if no amount selected
    if (amount <= 0) {
      alert('Please select an amount greater than 0 to convert');
      return;
    }

    // return if rates unavailable
    if (!this.state.rates || !this.state.rates[from] || !this.state.rates[to]) {
      alert('Rates not available.');
      return;
    }

    // convert using values of currency codes stored in from and to
    const conversionRate = this.state.rates[to] / this.state.rates[from]
    const convertedAmount = (amount * conversionRate).toFixed(2);

    // update convertedAmount state using shorthand (object key & variable name identical)
    this.setState({ convertedAmount });
  }
  
  render() {
    const { from, to, amount, convertedAmount, rates, error } = this.state;
    // if error, render error message in DOM
    if (error) {
      return (
        <p className="text-danger">{error}</p>
      )
    }
    // call child component CurrencyConverterTable for rendering in DOM
    return (
      <div className="container">
        <CurrencyConverterTable 
          from={from} 
          to={to} 
          amount={amount}
          convertedAmount={convertedAmount}
          rates={rates} 
        />
      </div>
    )
  }
}
  
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<CurrencyConverter />);
  
  
  
  