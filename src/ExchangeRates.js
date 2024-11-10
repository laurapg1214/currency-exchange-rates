import React from 'react';
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
          {/* loop through rates object to create rows */}
          Object.

        </tbody>
      </table>
      <div className="col-4 col-md-2 col-lg-1 mb-3">
          <h4>{base}</h4>
      </div>
      <div className="col-8 col-md-10 col-log-11 mb-3">
          <h4>{rate}</h4>
      </div>
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
        amount = parseFloat(amount);
        if (!amount) {
            return;
        }
        
        fetch(`https://api.frankfurter.app/latest`)
          .then(checkStatus)
          .then(json)
          .then((data) => {
            if (!data) {
              console.error('No data returned');
              this.setState({
                error: 'No data returned',
              });
              return;
            }
            console.log(data);
            // update state based on data from the api
            this.setState({
              base: data.base,
              date: data.date,
              rates: data.rates,
              // reset error if successful
              error:''
            })
          }
    }
  
    render() {
      const { base, date, rates, error } = this.state;
  
      return (
        <div className="container">
          <div className="text-center p-3 mb-2">
            <h2 className="mb-2">Exchange Rates</h2>
            <h4>{base}: {rate}</h4>
          </div>
          <div className="row text-center">
            <div className="col-12">
              <span className="mr-1">{symbol}</span>
              <input value={symbol} onChange={this.handleChange} type="number" />
            </div>
          </div>
        </div>
      )
    }
}
  
  const container = document.getElementById('root');
  const root = ReactDOM.createRoot(container);
  root.render(<ExchangeRates />);
  
  
  
  