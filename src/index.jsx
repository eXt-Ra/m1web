import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import './js/core/bootstrap.min.js';

import Map from './pages/map';
import Index from './pages/index';
import AddHouse from './pages/AddHouse';

ReactDOM.render(
  <AppContainer>
      <BrowserRouter>
        <Switch>
              <Route exact path="/" component={Index}/>
              <Route exact path="/map/:region" component={Map}/>
              <Route exact path="/addhouse" component={AddHouse}/>
        </Switch>
      </BrowserRouter>
  </AppContainer>,
  document.getElementById('app')
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./pages/index', () => {
    const NextApp = require('./pages/index').default;
    ReactDOM.render(
      <AppContainer>
        <BrowserRouter>
          <BrowserRouter>
            <Switch>
                  <Route exact path="/" component={Index}/>
                  <Route exact path="/map" component={Map}/>
            </Switch>
          </BrowserRouter>
        </BrowserRouter>
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
