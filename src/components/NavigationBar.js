import React from 'react';
import { 
  Link,
  NavLink
} from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h3>LPG Currency Exchange Rates</h3>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Exchange Rates
          </NavLink>
          <NavLink to="/converter" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Currency Converter
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;