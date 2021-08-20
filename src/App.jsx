import React from "react";
import { withRouter, Redirect, Route, Switch } from "react-router";
import userStorageManager from "./utils/userStorageManager";

import Header from "./components/header/header.component";
import Footer from "./components/footer/footer.component";

import "./App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: userStorageManager.getCurrentUser() || null,
      expiryTime: userStorageManager.getExpirationTime(),
    };
  }

  render() {
    const { currentUser } = this.state;
    // if (!currentUser) {
    //   return (
    //     <Redirect></Redirect>
    //   )
    // }
    return (
      <div className="app">
        <Header history={this.props.history} />
        <div className="app-container">
          <Switch></Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);
