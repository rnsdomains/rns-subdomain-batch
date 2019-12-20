import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import ValidateOwnership from './ValidateOwnership';
import Claim from './Claim';
import TransferToRegistrar from './TransferToRegistrar';
import { Link } from 'react-router-dom';

const Setup = ({ domain, claimed, transferred }) => (
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
          <p>Now you have to execute 2 transactions. You need to do this just once.</p>
          <p>Claim your domain in the batch registrar contract.</p>
          <Claim />
          <p>Transfer ownership to Subdomain Registrar.</p>
          <TransferToRegistrar enabled={claimed} />
          <i>
            Subdomain Registrar will sponsor your domain momentarily
            to register subdomains in batch.
          </i>
        </React.Fragment>
      }
      {
        domain && transferred &&
        <React.Fragment>
          <hr />
          <p>
            Please <Link to="/validate">validate your csv files</Link> before executing any registration.
          </p>
        </React.Fragment>
      }
    </div>
  </Container>
);

const mapStateToProps = ({ app }) => ({
  domain: app.domain,
  claimed: !!app.claim.tx,
  transferred: !!app.transferToRegistrar.tx,
});

export default connect(mapStateToProps)(Setup);
