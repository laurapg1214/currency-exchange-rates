import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Switch
} from "react-router-dom";
import NavigationBar from './components/NavigationBar.js';
import Footer from './components/Footer.js';
import { CurrencyConverter } from './components/CurrencyConverter.js';
import { ExchangeRates } from './components/ExchangeRates.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const NotFound = () => {
  return <h2>404 Not Found</h2>;
}

const App = () => {
  return (
    <Router>
      <div className="container">
        {/* Navigation Bar */}
        <NavigationBar />

        {/* Main Content */}
        <main>
          <Switch>
            <Route path="/" exact component={ExchangeRates} />
            <Route path="/converter" component={CurrencyConverter} />
            <Route path="*" component={NotFound} />
          </Switch>
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
