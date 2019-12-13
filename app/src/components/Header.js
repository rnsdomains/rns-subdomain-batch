import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
    <div className="container">
      <a className="navbar-brand" href=".">
        <img src="assets/img/logo.svg" className="logo" alt="logo" />
      </a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/setup">Setup</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/subdomains">Create subdomains</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/faq">FAQ</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);
