import React from "react";
import axios from "axios";
import { withRouter, Redirect, Route, Switch } from "react-router";
import userStorageManager from "./utils/userStorageManager";

import Header from "./components/header/header.component";
import Footer from "./components/footer/footer.component";

import LoginForm from "./components/login-form/login-form.component";
import Logout from "./components/logout/logout.component";

import "./App.scss";
import LandingPage from "./components/landing-page/landing-page.component";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: userStorageManager.getCurrentUser() || null,
      expiryTime: userStorageManager.getExpirationTime(),
    };
  }

  loginUser = (userData, expiry) => {
    this.setState(
      {
        currentUser: userData,
        expiryTime: expiry,
      },
      () => userStorageManager.setNewLogin(userData, expiry)
    );

    this.props.history.push("/");
  };

  logoutUser = async () => {
    try {
      await axios({
        method: "GET",
        url: "/api/users/logout",
      });

      this.setState(
        {
          currentUser: null,
          expiryTime: null,
        },
        () => {
          userStorageManager.logOut();
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { currentUser } = this.state;
    return (
      <div className="app">
        <Header history={this.props.history} />
        <div className="app-container">
          {!currentUser && <Redirect to="/login" />}
          <Switch>
            <Route
              path="/"
              exact
              component={() => <LandingPage history={this.props.history} />}
            />
            <Route
              path="/login"
              component={() => <LoginForm loginUser={this.loginUser} />}
            />
            <Route
              path="/logout"
              component={() => <Logout logout={this.logoutUser} />}
            />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);
