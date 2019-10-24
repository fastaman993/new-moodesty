import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";

import Login from "./containers/Login";
import Home from "./containers/Home";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" render={props => <Login {...props} />} />
            <Route exact path="/home" render={props => <Home {...props} />} />
          </Switch>
        </Router>
      </div>
    );
  }
}
