import React from 'react';

export const Header = () => (
  <nav class="navbar navbar-expand-md navbar-light bg-light fixed-top">
    <div class="container">
      <a class="navbar-brand" href="."><img src="assets/img/logo.svg" class="logo" alt="logo" /></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <a class="nav-link" href="/">Home<span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/setup">Setup</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/subdomains">Create subdomains</a>
          </li>
          <li class="nav-item">
              <a class="nav-link" href="/faq">FAQ</a>
          </li>
          <li class="nav-item">
            <button class="btn btn btn-primary my-2 my-sm-0" data-toggle="modal" data-target="#dialogo1">Start</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);
