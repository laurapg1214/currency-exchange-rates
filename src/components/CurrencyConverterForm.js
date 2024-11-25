import React from 'react';
import Select from 'react-select';
import { 
  generateDefaultFrom, 
  generateDefaultTo, 
} from '../utils/currencyUtils.js';

const CurrencyConverterForm = (props) => {
  // destructure props from state
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
    rates,
    error,
  } = props.state;

  // placeholder while rates loading
  if (!rates) {
    return <p>Loading rates...</p>
  };

  // if error, render error message in DOM
  if (error) {
    return (
      <div className='error-container'>
        <div className='error'>{ error }</div>
      </div>
    )
  };

  // generate default base object
  const defaultFrom = generateDefaultFrom(from, currencies);

  // generate default target object
  const defaultTo = generateDefaultTo(to);

  // return Currency Converter table
  return (
    <div className="inner-container" id="currency-converter-container">
      <h3 className="text-center mb-4">Currency Converter</h3>

      {/* row with labels */}
      <div className="row mb-2 currency-converter-row">
        <div className="col-12 col-md-4">
          {/* htmlFor for accessibility */}
          <label htmlFor="from-currency" className="label">From</label>
        </div>
        <div className="col-12 col-md-3">
          {/* empty column for switch button in row below */}
        </div>
        <div className="col-12 col-md-4">
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
              onChange={ (selectedOption) => props.handleCurrencySelect(selectedOption, 'from') }
              getOptionLabel={(currency) => (
                <div className="currency-option">
                  {/* use of images with react-select adapted from 
                  https://stackoverflow.com/questions/45940726/populate-react-select-with-image */}
                  <img 
                    src={ currency.image } 
                    alt={`${ currency.label } flag`} 
                    style={{ width: 16, marginRight: 8 }}
                  />
                  <span>{ currency.label }</span>
                </div>
              )}
            /> 
          </div>
        </div>
        <div className="col-3" id="switch-button">
          <div id="switch-button">
            {/* switch arrow between currencies from 
            https://www.toptal.com/designers/htmlarrows/arrows/left-arrow-over-right-arrow/ */}
            <button 
              className="btn btn-success" 
              id="switch-button"
              onClick={ props.switchFromTo }
            >
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
              onChange={ (selectedOption) => props.handleCurrencySelect(selectedOption, 'to') }
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
              onChange={ props.handleAmountChange }
              // switch to fromAmount on focus
              onFocus={ props.hideDisplayFormatted }
              // attach blur method to input field
              ref={ props.inputRef }
              // enter key press = convert button press
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  props.handleSubmit(event);
                }
              }}
            />
          </div>
        </div>
        <div className="col-3" id="equal-sign">
          <h4>{ equalSign }</h4>
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
          onClick={ props.handleSubmit }
        >
          Convert
        </button>
      </div>
    </div>
  )
}

export default CurrencyConverterForm;
