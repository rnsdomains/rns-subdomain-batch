import React, { Component } from 'react';
import {
  Form,
  Container,
  Button,
  InputGroup,
  FormControl,
  FormGroup,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      domain: '',
    };

    this.handleChangeDomain = this.handleChangeDomain.bind(this);
  }

  handleChangeDomain(event) {
    this.setState({ domain: event.target.value });
  }

  render() {
    const { domain } = this.state;

    return (
      <Container>
        <div className="col-lg-12 text-center main-title-box">
          <h1><b>RNS Subdomains</b></h1>
          <p>
            Use this tool to create subdomains in batch.
          </p>
          <hr />
          <h3>Requirements</h3>
          <a
            href="https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nifty Wallet
          </a>
          {' (recommended) or '}
          <a
            href="https://metamask.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Metamask
          </a>
          <hr />
          An RNS name
          <br />
          <i>Skip this if you already own one with your browser wallet.</i>
          <Form onSubmit={(event) => {
            event.preventDefault();
            window.location.href(`https://manager.rns.rifos.org/register?name=${domain}`);
          }}
          >
            <FormGroup>
              <InputGroup>
                <FormControl type="text" onChange={this.handleChangeDomain} />
                <InputGroup.Append>
                  <Button type="submit">Register</Button>
                </InputGroup.Append>
              </InputGroup>
            </FormGroup>
          </Form>
          <hr />
          <Link to="/setup">Setup</Link>
          {' your domain'}
        </div>
      </Container>
    );
  }
}
