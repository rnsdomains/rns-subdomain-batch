import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ValidateOwnership from './ValidateOwnership';
import { connect } from 'react-redux';

const Setup = ({ domain }) => (
  <Container>
    <div className="col-lg-12 text-center main-title-box">
      <h1><b>Setup</b></h1>
      {
        domain ?
        <h3>{domain}</h3> :
        <React.Fragment>
          <p>Authenticate your domain</p>
          <ValidateOwnership />
          <i>Check the domain you will use to register subdomains of.</i>
        </React.Fragment>
      }
      {
        domain &&
        <React.Fragment>
          <hr />
          <p>
            Transfer ownership to Subdomain Registrar.
            <i>Subdomain Registrar will sponsor your domain momentarily
            to register subdomains in batch.</i>
          </p>
          <Button>Transfer</Button>
          {'Make your '}
          <code>csv</code>
          {' compatible.'}
          <br />
          <ul>
            <li>First column contains domains</li>
            <li>Second column contains addresses</li>
          </ul>
          <i>Any incompatible name will be notified before registration</i>
          <Link to="/subdomains">Register subdomains!</Link>
        </React.Fragment>
      }
    </div>
  </Container>
);

const mapStateToProps = (state) => ({
  domain: state.app.domain,
});

export default connect(mapStateToProps)(Setup);
