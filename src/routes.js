import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './components/App';
import Home from './components/Home';
import About from './components/About';
import People from './components/People';

const routes = (
  <App>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/about' component={About} />
      <Route path='/people' component={People} />
    </Switch>
  </App>
)

export { routes };
