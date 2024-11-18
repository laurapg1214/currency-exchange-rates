import React from 'react';
import { CurrencyConverter } from './components/CurrencyConverter.js';
import { ExchangeRates } from './components/ExchangeRates.js';
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
