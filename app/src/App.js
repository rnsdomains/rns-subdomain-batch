import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {
  Header,
  Footer,
  Home,
  Setup,
  Subdomains,
  FAQ,
} from './components';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/setup">
          <Setup />
        </Route>
        <Route path="/subdomains">
          <Subdomains />
        </Route>
        <Route path="/faq">
          <FAQ />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
