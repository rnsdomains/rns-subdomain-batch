import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default () => (
  <Container>
    <div className="col-lg-12 text-center main-title-box">
      <h1><b>Setup</b></h1>
      <ol>
        <li>
          <p>
            Transfer ownership to Subdomain Registrar.
            {' '}
            <br />
            Subdomain Registrar will sponsor your domain momentarily
            to register subdomains in batch.
          </p>
          <Button>Transfer</Button>
        </li>
        <li>
          {'Make your '}
          <code>csv</code>
          {' compatible.'}
          <br />
          <ul>
            <li>First column contains domains</li>
            <li>Second column contains addresses</li>
          </ul>
          <i>Any incompatible name will be notified before registration</i>
        </li>
        <li>
          <Link to="/subdomains">Register subdomains!</Link>
        </li>
      </ol>
    </div>
  </Container>
);
