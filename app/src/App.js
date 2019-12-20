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
  ValidateCSV,
  Subdomains,
  FAQ,
} from './components';

export default () => (
  <>
    <Header />
    <Switch>
      <Route path="/setup" render={() => <Setup />} />
      <Route path="/validate" render={() => <ValidateCSV />} />
      <Route path="/subdomains" render={() => <Subdomains />} />
      <Route path="/faq" render={() => <FAQ />} />
      <Route path="/" render={() => <Home />} />
    </Switch>
    <Footer />
  </>
);
