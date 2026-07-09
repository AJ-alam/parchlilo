import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="fg">
        <div>
          <span className="logo-wordmark" style={{ fontSize: '16px' }}>
            <span>PAR</span><span className="logo-invert">CHI</span><span>LO</span>
          </span>
          <p className="fd">
            An interactive single-page app for invoice management and generation, powered by Nexaura Technologies.
          </p>
        </div>
        <div>
          <div className="fct">Navigation</div>
          <ul className="fl">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <div className="fct">Legal Documents</div>
          <ul className="fl">
            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="fb">
        <div className="fbc">© 2026 <span>Parchilo</span>. All rights reserved. Built by Nexaura.</div>
        <div className="fbr">
          <span className="fchip">Local DB Active</span>
          <span className="fchip">v4.5 (Dual Mode)</span>
        </div>
      </div>
    </footer>
  );
}
