import React from 'react';
import { json, checkStatus } from './utils';

class CurrencyConverter extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        amount: 0.0,
        base: '',
        date: '',
        rates: {},
        error: '',
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
        // update amount as user types
        this.setState({ amount: event.target.value });
    }
  
    handleSubmit(event) {
        event.preventDefault();
        let { amount } = this.state;
        amount = amount.parseFloat();
        if (!amount) {
            return;
        }
        
        // fetch api call to frankfurter.app
    }
  
    render() {
      const { base, date, rates, error } = this.state;
  
      return (
        <div className="container">
          <div className="text-center p-3 mb-2">
            <h2 className="mb-2">Currency Converter</h2>
            <h4>USD 1: {rate} EURO</h4>
          </div>
          <div className="row text-center">
            <div className="col-12">
              <span className="mr-1">USD</span>
              <input value={usd} onChange={this.handleUsdChange} type="number" />
              <span className="mx-3">=</span>
              <input value={euro} onChange={this.handleEuroChange} type="number" />
              <span className="ml-1">EURO</span>
            </div>
          </div>
        </div>
      )
    }
}
  
  const container = document.getElementById('root');
  const root = ReactDOM.createRoot(container);
  root.render(<CurrencyConverter />);
  
  
  
  