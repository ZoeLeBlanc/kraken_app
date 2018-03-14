import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Projects from './components/Projects';
// import Test from './components/Test';
import Dashboard from './containers/Dashboard';
// import GraphTest from './containers/GraphTest';


export default (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/projects" component={Projects} />
    </Switch>
);
