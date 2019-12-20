import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import {
  Header,
  Footer,
  Home,
  Setup,
  Subdomains,
  FAQ,
} from './components';

export default () => (
  <>
    <Header />
    <Switch>
      <Route path="/setup" render={() => <Setup />} />
      <Route path="/subdomains" render={() => <Subdomains />} />
      <Route path="/faq" render={() => <FAQ />} />
      <Route path="/" render={() => <Home />} />
    </Switch>
    <Footer />
  </>
);
