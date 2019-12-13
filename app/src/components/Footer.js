import React from 'react';
import { Container, Row } from 'react-bootstrap';

export const Footer = () => (
  <footer>
    <div class="footer-top">
      <Container>
        <Row>
          <div class="col-lg-12">
            <img src="assets/img/powered_by_iov.svg" class="img-fluid powered_by" alt="powered_by" />
          </div>
          <div class="col-lg-4">
              <span class="footer-title mb-3">What is RNS?</span>
              <p class="mb-5">RIF Name Service provides an architecture which enables the identification of blockchain addresses by human-readable names.</p>
          </div>
          <div class="col-lg-3">
            <a href="https://gitter.im/rsksmart/rif-name-service" target="_blank" rel="noopener noreferrer">Gitter</a>
            <a href="https://rsksamrt.github.io/rif.rns/tools/subdomain-batch" target="_blank" rel="noopener noreferrer">Docs</a>
            <a href="https://github.com/rnsdomains/rns-subdomain-batch" target="_blank" rel="noopener noreferrer">Issues</a>
          </div>
          <div class="col-lg-3"></div>
          <div class="col-lg-2"></div>
        </Row>
      </Container>
    </div>
  </footer>
)

/*

      <div class="container">
        <div class="row ">
          <div class="col-lg-12"><img src="assets/img/powered_by_iov.svg" class="img-fluid powered_by"></div>
          <div class="col-lg-4">
              <span class="footer-title mb-3">What is RNS?</span>
              <p class="mb-5">RIF Name Service provides an architecture which enables the identification of blockchain addresses by human-readable names.</p>
          </div>
          <div class="col-lg-3">
              <span class="footer-title mb-3">Resolve your Domain</span>
              <input type="text" class="form-control form-control-reverse" placeholder="Resolve your domain" aria-label="Resolve">
              <button type="button" class="btn btn-secondary custom-mt-1 mb-5">Resolve</button>
          </div>
          <div class="col-lg-3">
              <span class="footer-title mb-3">Admin your Domain</span>
              <p>Admin Domain Resolution</p>
              <p>Create Subdomains</p>
              <button type="button" class="btn btn-secondary custom-mt-2 mb-5">Admin</button>
          </div>
          <div class="col-lg-2">
              <a href="">Rif white paper</a>
              <a href="">RNS white paper</a>
              <a href="">Libs</a>
              <a href="">Docs</a>
          </div>
        </div>
      </div>
  </footer>
  */