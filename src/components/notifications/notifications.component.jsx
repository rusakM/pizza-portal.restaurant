import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faBook } from "@fortawesome/free-solid-svg-icons";

import "./notifications.styles.scss";

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: parseInt(sessionStorage.getItem("messages"), 10) || 0,
      orders: parseInt(sessionStorage.getItem("orders"), 10) || 0,
    };
  }

  async componentDidMount() {
    if (RegExp(/^\/messages/).test(window.location.pathname)) {
      this.reset("messages");
    }
    if (RegExp(/^\/orders/).test(window.location.pathname)) {
      this.reset("orders");
    }
    const { socket } = this.props;
    socket.on("booking", (data) => {
      sessionStorage.setItem("orders", this.state.orders + 1);
      this.setState({
        orders: this.state.orders + 1,
      });
    });

    socket.on("message", (data) => {
      sessionStorage.setItem("messages", this.state.messages + 1);
      this.setState({
        messages: this.state.messages + 1,
      });
    });
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.off("message");
    socket.off("booking");
  }

  reset = (field) => {
    this.setState(
      {
        [field]: 0,
      },
      () => sessionStorage.setItem(field, 0)
    );
  };

  render() {
    const { messages, orders } = this.state;
    const { history } = this.props;
    return (
      <aside className="notifications">
        {orders > 0 && (
          <div
            className="notifications-btn"
            onClick={() => history.push("/orders")}
          >
            <span>
              <FontAwesomeIcon icon={faBook} />
              &nbsp;
              {orders}
            </span>
          </div>
        )}
        {messages > 0 && (
          <div
            className="notifications-btn"
            onClick={() => history.push("/messages")}
          >
            <span>
              <FontAwesomeIcon icon={faEnvelope} />
              &nbsp;
              {messages}
            </span>
          </div>
        )}
      </aside>
    );
  }
}

export default Notifications;
