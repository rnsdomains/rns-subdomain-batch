import React, { Component } from 'react';
import {
  Container, Table, Spinner, Button,
} from 'react-bootstrap';
import CSVReader from 'react-csv-reader';
import { isAddress } from 'web3-utils';
import { connect } from 'react-redux';

const parseSolvedErrors = (errors) => {
  let error = '';

  if (errors.labelNoSpaces) error += 'No spaces\n';

  if (errors.labelToLower) error += 'Lower cases\n';

  if (errors.noMails) error += 'No mails\n';

  if (errors.labelsNoEnie) error += 'No \'ñ\'\n';

  return error.trim();
};

const parseUnsolvedErrors = (errors) => {
  let error = '';

  if (errors.invalidAddress) error += 'Invalid address\n';

  return error.trim();
};

class Subdomains extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validating: false,
      data: null,
      allSolvedConflicts: null,
      allUnsolvedConflicts: null,
      parsed: null,
      accepted: false,
    };

    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.accept = this.accept.bind(this);
  }

  handleUploadFile(data) {
    this.setState({ validating: true });

    const allSolvedConflicts = [];
    const allUnsolvedConflicts = [];

    const parsed = [];

    for (let i = 0; i < data.length; i += 1) {
      let [domain, address] = data[i];

      const solvedConflicts = {};
      const unsolvedConflicts = {};

      if (domain.indexOf(' ') >= 0) {
        domain = domain.replace(/ /g, '');
        solvedConflicts.labelNoSpaces = true;
      }

      if (domain !== domain.toLowerCase()) {
        domain = domain.toLowerCase();
        solvedConflicts.labelToLower = true;
      }

      const indexOfAt = domain.indexOf('@');
      if (indexOfAt >= 0) {
        domain = domain.slice(0, indexOfAt);
        solvedConflicts.noMails = true;
      }

      if (domain.indexOf('ñ') >= 0) {
        domain = domain.replace(/(ñ)/g, 'n');
        solvedConflicts.labelsNoEnie = true;
      }

      address = address.toLowerCase();

      if (!isAddress(address)) {
        unsolvedConflicts.invalidAddress = true;
      }

      allSolvedConflicts.push(solvedConflicts);
      allUnsolvedConflicts.push(unsolvedConflicts);
      parsed.push([domain, address]);
    }

    this.setState({
      validating: false,
      data,
      allSolvedConflicts,
      allUnsolvedConflicts,
      parsed,
    });
  }

  accept() {
    this.setState({ accepted: true });
  }

  render() {
    const {
      validating,
      data,
      allSolvedConflicts,
      allUnsolvedConflicts,
      parsed,
      accepted,
    } = this.state;

    const { domain } = this.props;

    return (
      <Container className="text-center">
        <div className="col-lg-12 main-title-box">
          <h1><b>Register subdomains</b></h1>
        </div>
        <p>
          Register subdomains importing a <code>csv</code> file.
        </p>
        <p>
          The
          {' '}
          <code>csv</code>
          {' '}
file must include only two columns:
            the labels to register in the first column
            and the address to set in the second column.
        </p>
        <p>
          First validate the entries. The app will apply some changes
          <span> </span>and request to approve them before registering.
        </p>
        <CSVReader onFileLoaded={this.handleUploadFile} disabled={validating} />
        {validating && <Spinner animation="grow" />}
        {!validating && parsed && !accepted && <Button onClick={this.accept}>Ok</Button>}
        {
          !validating && parsed && !accepted
          && (
          <Table>
            <thead>
              <tr>
                <th>input</th>
                <th>solved conflicts</th>
                <th>unsolved conflicts</th>
                <th>to register</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((value, index) => (
                  <tr key={value[1]}>
                    <td>{`(${value[0]}, ${value[1]})`}</td>
                    <td className={Object.keys(allSolvedConflicts[index]).length > 0 ? 'table-warning' : ''}><p>{parseSolvedErrors(allSolvedConflicts[index])}</p></td>
                    <td className={Object.keys(allUnsolvedConflicts[index]).length > 0 ? 'table-error' : ''}><p>{parseUnsolvedErrors(allUnsolvedConflicts[index])}</p></td>
                    <td><p>{`(${parsed[index][0]}.${domain}, ${parsed[index][1]})`}</p></td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
          )
        }
        <hr />
      </Container>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  domain: app.domain,
});

export default connect(mapStateToProps)(Subdomains);
