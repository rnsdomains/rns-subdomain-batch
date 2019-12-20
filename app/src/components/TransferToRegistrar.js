import React from 'react';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { transferToRegistrar } from '../operations';
import { connect } from 'react-redux';
import Tx from './Tx';

const TransferToRegistrarComponent = ({ enabled, transferToRegistrar, transferring, tx, error }) => {
  const disabled = !enabled || transferring;

  return (
    <Form onSubmit={e => {
      e.preventDefault();
      transferToRegistrar();
    }}>
      {!tx && <FormGroup>
        <Button type="submit" className={disabled && 'btn-info'} disabled={disabled}>Transfer</Button>
      </FormGroup>}
      {tx && <small className="text-success"><Tx tx={tx.transactionHash} /></small>}
      {error && <small className="text-danger">{error.message}</small>}
    </Form>
  );
};

const mapStateToProps = ({ app }) => ({
  ...app.transferToRegistrar,
  domain: app.domain,
  from: app.owner,
});

const mapDispatchToProps = dispatch => ({
  transferToRegistrar: (domain, from) => dispatch(transferToRegistrar(domain, from)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  transferToRegistrar: () => dispatchProps.transferToRegistrar(stateProps.domain, stateProps.from),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(TransferToRegistrarComponent);
