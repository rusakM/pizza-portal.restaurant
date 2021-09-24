import React from "react";
import axios from "axios";
import { withRouter, Redirect, Route, Switch } from "react-router";
import io from "socket.io-client";
import userStorageManager from "./utils/userStorageManager";

import Header from "./components/header/header.component";
import Footer from "./components/footer/footer.component";
import Notifications from "./components/notifications/notifications.component";

import LoginForm from "./components/login-form/login-form.component";
import Logout from "./components/logout/logout.component";

import "./App.scss";
import LandingPage from "./components/landing-page/landing-page.component";
import OrderCreator from "./components/order-creator/order-creator.component";
import OrderViewer from "./components/order-viewer/order-viewer.component";
import OrdersList from "./components/orders-list/orders-list.component";
import MessagesList from "./components/messages-list/messages-list.component";

const socket = io(`${window.location.protocol}//${window.location.hostname}`);

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
            <Route
              path="/orders"
              component={() => <OrdersList history={this.props.history} />}
              exact
            />
            <Route
              path="/orders/create"
              component={() => <OrderCreator history={this.props.history} />}
            />
            <Route
              path="/orders/view/:id"
              component={() => (
                <OrderViewer
                  history={this.props.history}
                  currentUser={currentUser}
                />
              )}
            />
            <Route path="/messages" component={() => <MessagesList />} />
          </Switch>
        </div>
        <Footer />
        <Notifications history={this.props.history} socket={socket} />
      </div>
    );
  }
}

export default withRouter(App);
