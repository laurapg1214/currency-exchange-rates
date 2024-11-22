import React from 'react';
import { format } from 'date-fns';
import ExchangeRatesForm from './ExchangeRatesForm.js';
import { 
  fetchRates,
  fetchCurrencies,
} from './CurrencyFunctions.js';

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
    return (
      <div className="exchange-rates-form">
        <ExchangeRatesForm
          // pass state variables as single prop
          state={ this.state }
          // pass state method
          handleBaseRateSelect={this.handleBaseRateSelect}
        />
      </div>
    )
  }
}