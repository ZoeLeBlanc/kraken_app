import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Test from './components/Test';
import People from './containers/People';
import GraphTest from './containers/GraphTest';


export default (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/projects" component={Projects} />
        <Route path="/test" component={Test} />
        <Route path="/people" component={People} />
        <Route path="/graphtest" component={GraphTest} />
    </Switch>
);
