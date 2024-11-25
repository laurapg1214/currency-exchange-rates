import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 LPG Currency Exchange Rates by Laura Gates.&nbsp;
          <a id="footer-license-link" href="/LICENSE.txt" target="_blank" rel="noopener noreferrer">MIT License</a>.
        </p>
        <div className="row">
          <a id="footer-social-link" href="https://github.com/laurapg1214" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>github.com/laurapg1214
          </a>
          <a id="footer-social-link" href="https://www.linkedin.com/in/laurapg1214/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>linkedin/in/laurapg1214
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

