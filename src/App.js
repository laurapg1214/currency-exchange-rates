import React from 'react';
import { CurrencyConverter } from './CurrencyConverter';
import { ExchangeRates } from './ExchangeRates';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const NotFound = () => {
  return <h2>404 Not Found</h2>;
}

const App = () => {
  return (
    <div className="container mt-5">
      {/* Currency Converter component */}
      <CurrencyConverter />

      {/* spacer */}
      <hr /> 

      {/* Exchange Rates component */}
      <ExchangeRates />
    </div>
  );
}

export default App;
