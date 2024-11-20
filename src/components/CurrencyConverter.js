import React from 'react';
import Select from 'react-select';
import currencyToLocale from 'currency-to-locale'; // my package on npm
import { json, checkStatus } from '../utils.js';
import { 
  generateDefaultFrom, 
  generateDefaultTo, 
  fetchRates,
  fetchCurrencies, 
} from './Currencies.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// container component 
export class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from: 'USD',
      to: 'INR',
      fromAmount: '1',
      fromFormatted: '',
      toFormatted: '',
      fromLabel: 'Amount to convert:',
      toLabel: '',
      displayFormatted: false, // controls what shows in from input field
      equalSign: '', // empty until convert button clicked
      currencies: null,
      rates: null,
      error: '',
    };

    // create ref to input field for control of focus & blurring
    this.inputRef = React.createRef();

    // bind methods
    this.handleFromSelect = this.handleFromSelect.bind(this);
    this.handleToSelect = this.handleToSelect.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.convert = this.convert.bind(this);
  }

  // handler for base currency selected from dropdown
  handleFromSelect(selectedOption) {
    // update base currency from selection
    this.setState({ 
      from: selectedOption.label,
      // reset from label & values
      fromLabel: `Amount in ${ selectedOption.label }`,
      displayFormatted: false,
      fromFormatted: '',
      toFormatted: '',
    })
    // fetch rates with new base
    fetchRates(this.state.from)
  }

  // handler for target currency selected from dropdown
  handleToSelect(selectedOption) {
    // update target currency from selection
    this.setState({ 
      to: selectedOption.label,
      // reset to label & values
      fromFormatted: '',
      displayFormatted: false,
      toLabel: `Amount in ${ selectedOption.label }`,
      toFormatted: '',
    })
  }

  // handler for amount input by user
  handleAmountChange(event) {
    const inputValue = (event.target.value)
    // allow empty input field if user deletes current value
    if (inputValue === '') {
      this.setState({ fromAmount: '' });
    } 
    this.setState({
      fromAmount: inputValue,
      displayFormatted: false
    })
  }

  // submit event handler
  handleSubmit(event) {
    event.preventDefault();

    // remove focus from input field
    if (this.inputRef.current) {
      this.inputRef.current.blur();
    }
    
    // run conversion
    let { from, to, fromAmount } = this.state;
    this.convert(from, to, fromAmount);
  }

  // conversion function
  convert(from, to, fromAmount) {
    // convert entered amount to float
    const floatAmount = parseFloat(fromAmount);

    // check for non-numeric or negative entry
    if (isNaN(floatAmount) || floatAmount < 0) {
      this.setState({
        error: "Please enter a positive number to convert."
      });
      return;
    }

    // get locale IDs from currency codes
    const fromLocaleID = currencyToLocale(from);
    const toLocaleID = currencyToLocale(to);

    fetch(`https://api.frankfurter.app/latest?base=${from}&symbols=${to}`)
      .then((response) => response.json())
      .then((data) => {
        // create conversion value independent of state update for convertedAmt
        const toAmount = (
          // adapted from frankfurter.dev
          fromAmount * data.rates[to]
        ).toFixed(2);

        // update state with conversion & formatted values
        this.setState ({
          fromFormatted: (Intl.NumberFormat(
            fromLocaleID, 
            { style: "currency", currency: from }
          ).format(fromAmount)),
          fromLabel: `Amount in ${from}`,
          toFormatted: (Intl.NumberFormat(
            toLocaleID, 
            { style: "currency", currency: to }
          ).format(toAmount)),
          // show to amount label
          toLabel: `Amount in ${to}`,
          // toggle to fromFormatted in input field
          displayFormatted: true,
          equalSign: '=',
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
    const { from } = this.state;

    // focus input field to allow onKeyDown listener,
    // with slight delay to give element time to render
    setTimeout(() => {
      if (this.inputRef.current) {
        this.inputRef.current.focus();
      };
    }, 100);

    // fetch full list of currencies
    fetchCurrencies()
      .then((currencies) => {
        this.setState({
          currencies,
          // reset error state if successful
          error:''
        });
      })
      .catch((error) => {
        this.setState({ 
          currencies: null,
          error: error.message
        });
      });

    // fetch rates using current base (from)
    fetchRates(from)
      .then((rates) => {
        this.setState ({
          rates,
          error: ''
        })
      })
      .catch((error) => {
        console.errer("Error fetching rates:", error);
        this.setState({
          error: `Error fetching rates: ${error}`
        })
      })
  }
  
  render() {
    const { 
      from, 
      to, 
      fromAmount,
      fromFormatted,
      displayFormatted,
      fromLabel, 
      toFormatted, 
      toLabel,
      equalSign,
      currencies,
      error 
    } = this.state;

    // placeholder while rates loading
    if (!this.state.rates) {
      return <p>Loading rates...</p>
    };

    // if error, render error message in DOM
    if (error) {
      return (
        <div className='error-container'>
          <div className='error'>{error}</div>
        </div>
      )
    }

    // generate default base object
    const defaultFrom = generateDefaultFrom(from);

    // generate default target object
    const defaultTo = generateDefaultTo(to);

    // return Currency Converter table
    return (
      <div className="inner-container" id="currency-converter-container">
        <h3 className="text-center mb-4">Currency Converter</h3>

        {/* row with labels */}
        <div className="row mb-2 currency-converter-row">
          <div className="col-4">
            {/* htmlFor for accessibility */}
            <label htmlFor="from-currency" className="label">From</label>
          </div>
          <div className="col-3">
            {/* empty column for switch button in row below */}
          </div>
          <div className="col-4">
            <label htmlFor="to-currency" className="label">To</label>
          </div>
        </div>
    
        {/* row with dropdowns */}
        <div className="row mb-4 currency-converter-row">
          <div className="col-4">
            <div className="dropdown">
              <Select
                // associate component with label htmlFor
                id="from-currency"
                // show base currency selection
                value={ defaultFrom }
                // pass array of currency objects
                options={ currencies }
                onChange={ this.handleFromSelect }
                getOptionLabel={(currency) => (
                  <div className="currency-option">
                    {/* use of images with react-select adapted from 
                    https://stackoverflow.com/questions/45940726/populate-react-select-with-image */}
                    <img 
                      src={currency.image} 
                      alt={`${ currency.label } flag`} 
                      style={{ width: 16, marginRight: 8 }}
                    />
                    <span>{currency.label}</span>
                  </div>
                )}
              /> 
            </div>
          </div>
          <div className="col-3" id="switch-button">
            <div id="switch-button">
              {/* switch arrow between currencies from 
              https://www.toptal.com/designers/htmlarrows/arrows/left-arrow-over-right-arrow/ */}
              <button className="btn btn-success" id="switch-button">
                <span>&#8646;</span>
              </button>
            </div>
          </div>
          <div className="col-4">
            <div className="dropdown">
              {/* target currency dropdown */}
              <Select
                // associate component with label htmlFor
                id="to-currency"
                // match current currency selection
                value={ defaultTo } 
                // pass array of currency objects
                options={ currencies }
                onChange={ this.handleToSelect }
                getOptionLabel={(currency) => (
                  <div className="currency-option">
                    <img 
                      src={currency.image} 
                      alt={`${ currency.label } flag`} 
                      style={{ width: 16, marginRight: 8 }}
                    />
                    <span>{currency.label}</span>
                  </div>
                )}
              /> 
            </div>
          </div>
        </div>
        
        {/* row with labels */}
        <div className="row mb-2 currency-converter-row">
          <div className="col-4">
            {/* htmlFor for accessibility */}
            <label htmlFor="from-amount" className="label">{ fromLabel }</label>
          </div>
          <div className="col-3">
            {/* empty column for equal sign in row below */}
          </div>
          <div className="col-4">
            <label htmlFor="to-amount" className="label">{ toLabel }</label> 
          </div>
        </div>

        {/* row with amount boxes */}
        <div className="row mb-4 currency-converter-row">
          {/* from amount input */}
          <div className="col-4">
            <div>
              {/* from amount input field */}
              <input  
                type="text"
                id="from-amount"
                className="amount-field" 
                // toggles between fromFormatted & fromAmount
                value={ displayFormatted ? fromFormatted : fromAmount }
                onChange={ this.handleAmountChange }
                // switch to fromAmount on focus
                onFocus={ () => this.setState({ displayFormatted: false }) }
                // attach blur method to input field
                ref={ this.inputRef }
                // enter key press = convert button press
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    this.handleSubmit(event);
                  }
                }}
              />
            </div>
          </div>
          <div className="col-3">
            <h4>{equalSign}</h4>
          </div>
          <div className="col-4">
            {/* target amount (converted) */}
            <div>
              <input 
                type="text" 
                className="amount-field"
                id="to-amount"
                value={ toFormatted } 
                readOnly
                disabled={ !toFormatted } // disabled before conversion
              />
            </div>
          </div>
        </div>

        {/* convert button */}
        <div id="convert-button">
          <button 
            type="submit" 
            className="btn btn-success"
            onClick={ this.handleSubmit }
          >
            Convert
          </button>
        </div>
      </div>
    )
  }
}

  
  
  
  