import React from 'react';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import {
  Header,
  Footer,
  Home,
  Setup,
  Subdomains,
  FAQ,
  Auth,
  NotFound,
  Register,
} from './components';
import Admin from './components/Admin';
import { connect } from 'react-redux';
import { NODE_OWNER, REGISTRANT } from './types';

const App = ({ showRegister, showAdmin }) => (
  <>
    <Header />
    <Switch>
      <Route exact path="/" render={() => <Home />} />
      <Route path="/setup" render={() => <Setup />} />
      <Route path="/subdomains" render={() => showRegister ? <Subdomains /> : <Redirect to="/login" />} />
      <Route path="/register" render={() => showRegister ? <Register /> : <Redirect to="/login" />} />
      <Route path="/admin" render={() => showAdmin ? <Admin /> : <Redirect to="/login" />} />
      <Route path="/login" render={() => <Auth />} />
      <Route path="/faq" render={() => <FAQ />} />
      <Route render={() => <NotFound />} />
    </Switch>
    <Footer />
  </>
);


const mapStateToProps = ({ app }) => ({
  showRegister: app.auth.permissions.includes(REGISTRANT),
  showAdmin: app.auth.permissions.includes(NODE_OWNER),
});

export default connect(mapStateToProps)(App);
