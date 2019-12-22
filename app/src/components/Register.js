import React from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { sha3 } from 'web3-utils';
import { register } from '../operations';
import Tx from './Tx';

const Register = ({ dataSize, register, tx, error }) => (
  <Container className="text-center">
    <div className="col-lg-12 main-title-box">
      <h1><b>Execute registration</b></h1>
    </div>
    <Row>
      <Col>
        <p>Register {dataSize} entries</p>
      </Col>
    </Row>
    <Form onSubmit={(e) => {
      e.preventDefault();
      register();
    }}
    >
      {!tx && <FormGroup><Button type="submit" disabled={tx && !!tx.transactionHash}>Register</Button></FormGroup>}
      {tx && <small className="text-success"><Tx tx={tx.transactionHash} /></small>}
      {error && <small className="text-danger">{error.message}</small>}
    </Form>
  </Container>
);

const parsedDataToWeb3 = (parsedData) => {
  const labels = []
  const addresses = []

  for (let i = 0; i < parsedData.length; i += 1) {
    labels.push(sha3(parsedData[i][0]));
    addresses.push(parsedData[i][1]);
  }

  return [labels,addresses];
}

const mapStateToProps = ({ app }) => ({
  data: parsedDataToWeb3(app.parsed),
  domain: app.domain,
  owner: app.owner,
  ...app.register,
});

const mapDispatchToProps = (dispatch) => ({
  register: (domain, labels, addresses, from) => dispatch(register(domain, labels, addresses, from)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  dataSize: stateProps.data[0].length,
  register: () => dispatchProps.register(
    stateProps.domain,
    stateProps.data[0],
    stateProps.data[1],
    stateProps.owner
  ),
  tx: stateProps.tx,
  error: stateProps.error,
  registering: stateProps.registering,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Register);
