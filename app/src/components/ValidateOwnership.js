import React, { Component } from 'react';
import { Form, FormControl, Button, InputGroup, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import { validateOwnership } from '../operations';
import { cleanValidateOwnership } from '../actions';

class ValidateOwnershipComponent extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: '',
      error: '',
    };

    this.validate = this.validate.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  handleChangeValue(e) {
    this.setState({ value: e.target.value });

    const { cleanValidateOwnership } = this.props;
    cleanValidateOwnership();
  }

  validate(event) {
    event.preventDefault();
    const { validateOwnership } = this.props;
    const { value } = this.state;

    validateOwnership(value);
  }

  render () {
    const { loading, error } = this.props;

    return (
      <Form onSubmit={this.validate}>
        <InputGroup>
        <FormControl type="text" placeholder="domain.rsk" disabled={loading} onChange={this.handleChangeValue} />
          <InputGroup.Append>
            <Button type="submit" disabled={loading}>Validate</Button>
          </InputGroup.Append>
        </InputGroup>
        {
          loading && <Spinner variant="grow" />
        }
        {
          error && <small className="text-danger">{error}</small>
        }
      </Form>
    )
  }
};

const mapStateToProps = state => ({
  loading: state.app.validateOwnership.loading,
  error: state.app.validateOwnership.error,
});

const mapDispatchToProps = dispatch => ({
  validateOwnership: (domain) => dispatch(validateOwnership(domain)),
  cleanValidateOwnership: () => dispatch(cleanValidateOwnership()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValidateOwnershipComponent);
