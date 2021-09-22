import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

import Alert from "../alert/alert.component";
import LoadingScreen from "../loading-screen/loading-screen.component";
import OrderViewerList from "../order-viewer-list/order-viewer-list.component";

import getIdFromPathname from "../../utils/getIdFromPathname";
import formatPrice from "../../utils/formatPrice";
import { formatFullDate } from "../../utils/formatDate";
import BOOKING_STATUSES from "../../utils/bookingStatuses";

class OrderViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: getIdFromPathname(this.props.history.location.pathname),
      orderData: null,
      errorMessage: null,
      isLoadingData: true,
      customerData: null,
    };
  }

  async componentDidMount() {
    try {
      const order = await axios({
        url: `/api/bookings/mapped-booking/${this.state.orderId}`,
        method: "GET",
      });

      this.setState({
        orderData: order.data.data.data,
        isLoadingData: false,
      });
    } catch (error) {
      this.setState({
        isLoadingData: false,
        errorMessage: "Nie ma takiego zamówienia",
      });
    }
  }

  checkStatus = (...statuses) => {
    const { orderData } = this.state;
    let arr = [];
    statuses.forEach((status) => {
      arr = [
        ...arr,
        ...orderData.history.filter((item) => item.description === status),
      ];
    });
    return arr.length === statuses.length;
  };

  updateOrder = async (data) => {
    const { orderId } = this.state;
    try {
      const updateOrder = await axios({
        method: "PATCH",
        url: `/api/bookings/${orderId}`,
        data,
      });
      this.setState({ orderData: updateOrder.data.data.data });
    } catch (error) {
      console.log(error);
    }
  };

  sendStatus = async (status) => {
    const { orderId, orderData } = this.state;

    try {
      const sentStatus = await axios({
        method: "POST",
        url: `/api/bookings/${orderId}/history`,
        data: {
          description: status,
        },
      });
      orderData.history.unshift(sentStatus.data.data.data);

      this.setState({
        orderData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { orderData, errorMessage, isLoadingData } = this.state;
    return (
      <div className="container">
        {isLoadingData && <LoadingScreen>Wczytytwanie danych</LoadingScreen>}
        {errorMessage && (
          <Alert
            close={() => this.props.history.push("/orders")}
            closeBtn={true}
          >
            <h5>{errorMessage}</h5>
            <Button onClick={() => this.props.history.push("/orders")}>
              Przejdź do listy zamówień
            </Button>
          </Alert>
        )}
        {orderData && (
          <div className="container">
            <div className="wrapper">
              <h2>Zamówienie nr: {orderData.barcode}</h2>
            </div>
            <div className="wrapper">
              <p>
                Czas przyjęcia zamówienia: {formatFullDate(orderData.createdAt)}
              </p>
              {orderData.paid ? (
                <h3 className="text-green">Zamówienie opłacone</h3>
              ) : (
                <h3 className="text-red">Zamówienie nieopłacone</h3>
              )}
              <h5>Wartość zamówienia: {formatPrice(orderData.price)}</h5>
              <h4>Zamawiający:</h4>
              <h6>
                {orderData.user.name}&nbsp;-&nbsp;
                <span>{orderData.user.email}</span>
              </h6>
              {Boolean(orderData.isWithDelivery && orderData.address) && (
                <div className="wrapper">
                  <h5>Adres dostawy:</h5>
                  <p>
                    {orderData.address.street}&nbsp;
                    {orderData.address.houseNumber}
                    {orderData.address.flatNumber &&
                      `/${orderData.address.flatNumber}`}
                  </p>
                  <p>
                    {orderData.address.zipCode}&nbsp;{orderData.address.city}
                  </p>
                  <p>+48 {orderData.address.phoneNumber}</p>
                </div>
              )}
            </div>
            <div className="wrapper flex-row">
              {!orderData.paid && (
                <Button onClick={() => this.updateOrder({ paid: true })}>
                  Przyjmij wpłatę
                </Button>
              )}
              {Boolean(
                !this.checkStatus(BOOKING_STATUSES.inProcess) && orderData.paid
              ) && (
                <Button
                  onClick={() => this.sendStatus(BOOKING_STATUSES.inProcess)}
                >
                  Przyjmij do realizacji
                </Button>
              )}
              {Boolean(
                this.checkStatus(BOOKING_STATUSES.inProcess) &&
                  !orderData.isFinished
              ) && (
                <Button onClick={() => this.updateOrder({ isFinished: true })}>
                  Zakończ zamówienie
                </Button>
              )}
              {Boolean(
                this.checkStatus(
                  BOOKING_STATUSES.inProcess,
                  BOOKING_STATUSES.paid
                ) &&
                  !this.checkStatus(BOOKING_STATUSES.ready) &&
                  !orderData.isFinished &&
                  !orderData.isWithDelivery &&
                  !orderData.isFinished
              ) && (
                <Button onClick={() => this.sendStatus(BOOKING_STATUSES.ready)}>
                  Gotowe do odbioru
                </Button>
              )}
              {orderData.isWithDelivery &&
                !this.checkStatus(BOOKING_STATUSES.shipping) &&
                orderData.paid && (
                  <Button
                    onClick={() => this.sendStatus(BOOKING_STATUSES.shipping)}
                  >
                    Wyślij dostawę
                  </Button>
                )}
              {!orderData.isFinished &&
                !this.checkStatus(BOOKING_STATUSES.cancel) && (
                  <Button
                    variant="danger"
                    onClick={() => this.sendStatus(BOOKING_STATUSES.cancel)}
                  >
                    Anuluj zamówienie
                  </Button>
                )}
            </div>
            {orderData.pizzas.length > 0 && (
              <OrderViewerList items={orderData.pizzas}>Pizze:</OrderViewerList>
            )}
            {orderData.ownPizzas.length > 0 && (
              <OrderViewerList items={orderData.ownPizzas}>
                Pizze:
              </OrderViewerList>
            )}
            {orderData.drinks.length > 0 && (
              <OrderViewerList items={orderData.drinks}>
                Napoje:
              </OrderViewerList>
            )}
            {orderData.sauces.length > 0 && (
              <OrderViewerList items={orderData.sauces}>Sosy:</OrderViewerList>
            )}
            <div className="wrapper">
              <h2>Historia zamówienia:</h2>
              <ul className="list">
                {orderData.history.map((item, num) => (
                  <li className="list-row container" key={item._id}>
                    <div className="wrapper">
                      <h5>
                        {orderData.history.length - num}.&nbsp;
                        {item.description}
                      </h5>
                      <p>{formatFullDate(item.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default OrderViewer;
