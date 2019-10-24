import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./public/redux/store";

import "./App.css";

import Login from "./containers/Login";
import Home from "./containers/Home";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Router>
            <Switch>
              <Route exact path="/" render={props => <Login {...props} />} />
              <Route exact path="/home" render={props => <Home {...props} />} />
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }
}
