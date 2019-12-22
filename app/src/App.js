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
  Auth,
} from './components';
import Admin from './components/Admin';

export default () => (
  <>
    <Header />
    <Switch>
      <Route path="/setup" render={() => <Setup />} />
      <Route path="/subdomains" render={() => <Subdomains />} />
      <Route path="/admin" render={() => <Admin />} />
      <Route path="/faq" render={() => <FAQ />} />
      <Route path="/login" render={() => <Auth />} />
      <Route path="/" render={() => <Home />} />
    </Switch>
    <Footer />
  </>
);
