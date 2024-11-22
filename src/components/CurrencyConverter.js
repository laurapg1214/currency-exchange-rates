import React from 'react';
import currencyToLocale from 'currency-to-locale'; // my package on npm
import CurrencyConverterForm from './CurrencyConverterForm.js';
import { 
  fetchRates,
  fetchCurrencies, 
} from './Currencies.js';

// container component 
export class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from: 'EUR',
      to: 'INR',
      fromAmount: '1',
      toAmount: '',
      fromFormatted: '',
      toFormatted: '',
      fromLabel: 'Convert:',
      toLabel: '',
      switchCurrenciesOnly: true, // for switchFromTo functionality
      displayFormatted: false, // controls what shows in from input field
      equalSign: '', // empty until convert button clicked
      currencies: null,
      rates: null,
      error: '',
    };

    // bind methods
    this.handleCurrencySelect = this.handleCurrencySelect.bind(this);
    this.switchFromTo = this.switchFromTo.bind(this);
    this.hideDisplayFormatted = this.hideDisplayFormatted.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.convert = this.convert.bind(this);

    // ref for input field for control of focus & blurring
    this.inputRef = React.createRef();
  }

  // handler for base/target currency selected from dropdowns
  handleCurrencySelect(selectedOption, type) {
    const isFrom = type === 'from';

    // update base/target currency from selection
    this.setState({ 
      [type]: selectedOption.label,
      // reset from label & values
      [`${ type }Label`]: selectedOption.value,
      fromFormatted: '',
      toFormatted: '',
      displayFormatted: false,
    }, () => {
      // callback - if base (from) updated, fetch rates
      if (isFrom) {
        fetchRates(this.state.from)
      }   
    });
  }
  
  // handler for switch button click
  switchFromTo(event) {
    // create tmp variables
    const fromTmp = this.state.from;
    const fromAmountTmp = this.state.fromAmount;
    const fromFormattedTmp = this.state.fromFormatted;
    const fromLabelTmp = this.state.fromLabel;

    this.setState({
      from: this.state.to,
      to: fromTmp,
    })

    if (!this.state.switchCurrenciesOnly) {
      this.setState({
        fromAmount: this.state.toAmount,
        toAmount: fromAmountTmp,
        fromFormatted: this.state.toFormatted,
        toFormatted: fromFormattedTmp,
        fromLabel: this.state.toLabel,
        toLabel: fromLabelTmp,
      });
    };
  }

  // handler for focus on from amount input field
  hideDisplayFormatted() {
    this.setState({ displayFormatted: false });
  }

  // handler for amount input by user
  handleAmountChange(event) {
    const inputValue = (event.target.value);

    // allow empty input field if user deletes current value
    if (inputValue === '') {
      this.setState({ fromAmount: '0' });
    } 
    this.setState({
      fromAmount: inputValue,
      displayFormatted: false,
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
      this.setState({ error: "Please enter a positive valid number." });
      return;
    }

    // get locale IDs from currency codes
    const fromLocaleID = currencyToLocale(from);
    const toLocaleID = currencyToLocale(to);

    fetch(`https://api.frankfurter.app/latest?base=${from}&symbols=${to}`)
      .then((response) => response.json())
      .then((data) => {
        // create conversion value independent of state update for convertedAmt
        // conversion calculation adapted from frankfurter.dev
        const toAmount = (fromAmount * data.rates[to]).toFixed(2);

        // update state with conversion & formatted values
        this.setState ({
          toAmount,
          fromFormatted: (Intl.NumberFormat(
            fromLocaleID, 
            { style: "currency", currency: from }
          ).format(fromAmount)),

          toFormatted: (Intl.NumberFormat(
            toLocaleID, 
            { style: "currency", currency: to }
          ).format(toAmount)),

          fromLabel: this.state.currencies.find(
            currency => currency.label === from
          // optional chaining using '?'
          )?.value || from,
          // show to amount label
          toLabel: this.state.currencies.find(
            currency => currency.label ===to
          )?.value || to,
          // toggle to fromFormatted in input field
          displayFormatted: true,
          // for switchFromTo functionality
          switchCurrenciesOnly: false,
          // show equal sign on first convert
          equalSign: '=',
          // reset error if successful
          error: '',
        });
      })
      // error handling
      .catch((error) => {
        this.setState(
          { error: "Sorry, unable to fetch the converted rate. Please try again later." }
        )
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
    fetchRates(from)
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
    return (
      <div className="currency-converter-form">
        <CurrencyConverterForm 
          // pass state variables as single prop
          state={ this.state }
          // pass state methods
          handleCurrencySelect={ this.handleCurrencySelect }
          switchFromTo={ this.switchFromTo }
          hideDisplayFormatted={ this.hideDisplayFormatted }
          handleAmountChange={ this.handleAmountChange }
          handleSubmit={ this.handleSubmit }
          convert={this.convert }
          // pass ref for input field
          inputRef={ this.inputRef }
        />
      </div>
    )
  }
}