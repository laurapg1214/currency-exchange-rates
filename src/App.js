import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
// import CurrencyConverter from './CurrencyConverter';
import ExchangeRates from './ExchangeRates';
import './App.css';

const NotFound = () => {
  return <h2>404 Not Found</h2>;
}

const App = () => {
  // state to keep track of selected base rate
  const [selectedBaseRate, setSelectedBaseRate] = useState(null);

  // function to update selected base rate
  const handleBaseRateSelect = (baseRate) => {
    setSelectedBaseRate(baseRate);
  }

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Currency Converter</Link>
      </nav>
      <Switch>
        <Route path="/" exact component={CurrencyConverter} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
