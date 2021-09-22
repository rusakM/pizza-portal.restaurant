import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

import OrdersListRow from "../orders-list-row/orders-list-row.component";
import LISTS from "./orders-list-names";

class OrdersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ordersList: [],
      skip: 0,
      listName: LISTS.unapproved,
    };
  }

  async componentDidMount() {
    try {
      const orders = await axios({
        method: "GET",
        url: `/api/bookings/${this.state.listName}`,
      });

      this.setState({
        ordersList: orders.data.data.data,
      });
    } catch (error) {}
  }

  openOrder = (orderId) => this.props.history.push(`/orders/view/${orderId}`);

  getMoreOrders = async () => {
    try {
      const orders = await axios({
        method: "GET",
        url: `/api/bookings/${this.state.listName}?skip=${
          this.state.skip + 25
        }`,
      });

      this.setState({
        ordersList: [...this.state.ordersList, ...orders.data.data.data],
        skip: this.state.skip + 25,
      });
    } catch (error) {}
  };

  changeList = async (listName) => {
    try {
      const orders = await axios({
        method: "GET",
        url: `/api/bookings/${listName}`,
      });

      this.setState({
        ordersList: orders.data.data.data,
        skip: 0,
        listName,
      });
    } catch (error) {}
  };

  render() {
    return (
      <div className="wrapper">
        <div className="flex-row">
          <Button onClick={() => this.changeList(LISTS.unapproved)}>
            Oczekujące
          </Button>
          <Button onClick={() => this.changeList(LISTS.unpaid)}>
            Nieopłacone
          </Button>
          <Button onClick={() => this.changeList(LISTS.pending)}>
            W przygotowaniu
          </Button>
          <Button onClick={() => this.changeList(LISTS.ready)}>
            Do odebrania
          </Button>
          <Button onClick={() => this.changeList(LISTS.shipping)}>
            Wysłane
          </Button>
          <Button onClick={() => this.changeList(LISTS.done)}>Ukończone</Button>
          <Button onClick={() => this.changeList(LISTS.canceled)}>
            Anulowane
          </Button>
          <Button onClick={() => this.changeList(LISTS.all)}>Wszystkie</Button>
        </div>
        <ul className="list wrapper">
          {this.state.ordersList.map((item) => (
            <OrdersListRow
              key={item.barcode}
              item={item}
              open={this.openOrder}
            />
          ))}
        </ul>
        <Button onClick={this.getMoreOrders}>Pobierz więcej</Button>
      </div>
    );
  }
}

export default OrdersList;
