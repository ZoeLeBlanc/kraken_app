import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import People from './containers/People';
import Graph from './containers/Graph';
import GraphTest from './containers/GraphTest';


export default (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/people" component={People} />
        <Route path="/graph" component={Graph} />
        <Route path="/graphtest" component={GraphTest} />
    </Switch>
);
