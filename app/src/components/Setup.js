import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ValidateOwnership from './ValidateOwnership';
import Claim from './Claim';
import TransferToRegistrar from './TransferToRegistrar';

const Setup = ({ domain, claimed, transferred }) => (
  <Container>
    <div className="col-lg-12 text-center main-title-box">
      <h1><b>Setup</b></h1>
      {
        domain
          ? <h3>{domain}</h3>
          : (
            <>
              <p>Authenticate your domain</p>
              <ValidateOwnership />
              <i>Check the domain you will use to register subdomains of.</i>
            </>
          )
      }
      {
        domain
        && (
          <>
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
          </>
        )
      }
      {
        domain && transferred
        && (
          <>
            <hr />
            <p>
            Please
              {' '}
              <Link to="/validate">validate your csv files</Link>
              {' '}
before executing any registration.
            </p>
          </>
        )
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
