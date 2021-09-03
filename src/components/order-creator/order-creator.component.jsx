import React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faPizzaSlice } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

import LoadingScreen from "../loading-screen/loading-screen.component";
import OrderSelectList from "../order-select-list/order-select-list.component";
import OrderCreatorList from "../order-creator-list/order-creator-list.component";
import MainMenuCard from "../main-menu-card/main-menu-card.component";
import OrderCreatorUserSelect from "../order-creator-user-select/order-creator-user-select.component";
import Alert from "../alert/alert.component";
import formatPrice from "../../utils/formatPrice";

class OrderCreator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pizzas: [],
      drinks: [],
      sauces: [],
      pizzasSelected: [],
      drinksSelected: [],
      saucesSelected: [],
      isLoadingData: true,
      errorMessage: "",
      isError: false,
      visibleListName: null,
      isTakeAway: false,
      user: null,
      searchPanelVisible: false,
      booking: null,
    };
  }

  async componentDidMount() {
    try {
      const pizzas = await axios({
        method: "GET",
        url: "/api/pizzas/templates",
      });

      const drinks = await axios({
        method: "GET",
        url: "/api/products?category=Napoje",
      });

      const sauces = await axios({
        method: "GET",
        url: "/api/products?category=Sosy",
      });

      this.setState({
        pizzas: this.mapPizzasInTemplates(pizzas.data.data.data),
        drinks: drinks.data.data.data,
        sauces: sauces.data.data.data,
        isLoadingData: false,
      });
    } catch (error) {
      this.setState({
        isError: true,
        errorMessage: error?.response.data.message,
        isLoadingData: false,
      });
    }
  }

  mapPizzasInTemplates = (list) =>
    list.map((item, i) => {
      const { name, _id } = item;
      item.smallPizza.name = `${name} 24cm`;
      item.smallPizza.templateId = _id;
      item.smallPizza.typeOfPizza = "smallPizza";
      item.numInList = i;
      item.mediumPizza.name = `${name} 32cm`;
      item.mediumPizza.templateId = _id;
      item.mediumPizza.typeOfPizza = "mediumPizza";
      item.largePizza.name = `${name} 42cm`;
      item.largePizza.templateId = _id;
      item.largePizza.typeOfPizza = "largePizza";
      return item;
    });

  openList = (visibleListName) => {
    this.setState({
      visibleListName,
    });
  };

  addItem = (item, quantity, category, size) => {
    if (category === "pizzas" && size) {
      item = item[size];
    }
    const list = this.state[`${category}Selected`];
    const filteredList = list.filter((elem, num) => {
      elem.num = num;
      return elem._id === item._id;
    });

    if (filteredList.length > 0) {
      const count = list[filteredList[0].num].count + quantity;
      list[filteredList[0].num].count = count;
      if (count < 1) {
        list.splice(filteredList[0].num, 1);
      }
    } else {
      item.count = quantity;
      list.push(item);
    }

    this.setState({
      [`${category}Selected`]: list,
    });
  };

  removeItem = (item, category) => {
    let list = this.state[`${category}Selected`];
    list = list.filter((i) => i._id !== item._id);

    this.setState({
      [`${category}Selected`]: list,
    });
  };

  calculateTotalPrice = () => {
    const { pizzasSelected, saucesSelected, drinksSelected } = this.state;
    const itemsArr = [...pizzasSelected, ...saucesSelected, ...drinksSelected];
    let sum = 0;
    if (itemsArr.length > 0) {
      sum = itemsArr
        .map(({ count, price }) => count * price)
        .reduce((total, val) => total + val);
    }
    return formatPrice(sum);
  };

  toggleField = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  selectUser = (user) => {
    this.setState({
      user,
      searchPanelVisible: false,
    });
  };

  makeCheckout = () => {
    const { pizzasSelected, saucesSelected, drinksSelected, isTakeAway, user } =
      this.state;
    const checkout = {
      isTakeAway,
      isWithDelivery: false,
      isPayNow: false,
    };
    if (pizzasSelected.length > 0) {
      checkout.pizzas = [];
      checkout.templates = [];
      for (let pizza of pizzasSelected) {
        for (let i = 0; i < pizza.count; i++) {
          checkout.pizzas.push(pizza._id);
          checkout.templates.push(pizza.templateId);
        }
      }
    }
    if (saucesSelected.length > 0) {
      checkout.sauces = [];
      for (let sauce of saucesSelected) {
        for (let i = 0; i < sauce.count; i++) {
          checkout.sauces.push(sauce._id);
        }
      }
    }

    if (drinksSelected.length > 0) {
      checkout.drinks = [];
      for (let drink of drinksSelected) {
        for (let i = 0; i < drink.count; i++) {
          checkout.drinks.push(drink._id);
        }
      }
    }

    if (user) {
      checkout.rewriteUser = user._id;
    }

    if (
      [...pizzasSelected, ...drinksSelected, ...saucesSelected].length === 0
    ) {
      return null;
    }

    return checkout;
  };

  sendOrder = async () => {
    const checkout = this.makeCheckout();
    if (!checkout) {
      return;
    }
    this.setState({
      isLoadingData: true,
    });
    try {
      const booking = await axios({
        url: "/api/bookings/",
        method: "POST",
        data: checkout,
      });

      const bookingPaid = await axios({
        method: "PATCH",
        url: `/api/bookings/${booking.data.data.data._id}`,
        data: {
          paid: true,
        },
      });

      this.setState({
        booking: bookingPaid.data.data.data,
        isLoadingData: false,
      });
    } catch (error) {
      this.setState({
        isLoadingData: false,
      });
    }
  };

  resetBooking = () => {
    this.setState({
      pizzasSelected: [],
      drinksSelected: [],
      saucesSelected: [],
      isLoadingData: false,
      errorMessage: "",
      isError: false,
      visibleListName: null,
      isTakeAway: false,
      user: null,
      searchPanelVisible: false,
      booking: null,
    });
  };

  render() {
    const {
      isLoadingData,
      visibleListName,
      pizzasSelected,
      drinksSelected,
      saucesSelected,
      isTakeAway,
      user,
      searchPanelVisible,
      booking,
    } = this.state;
    return (
      <div className="wrapper">
        {isLoadingData && <LoadingScreen></LoadingScreen>}
        <h1>Nowe zamówienie:</h1>
        <div className="order-creator wrapper">
          <div className="wrapper no-padding">
            <OrderCreatorList
              list={pizzasSelected}
              add={this.addItem}
              remove={this.removeItem}
              category="pizzas"
              openList={this.openList}
            >
              Pizze:
            </OrderCreatorList>
          </div>
          <div className="wrapper no-padding">
            <OrderCreatorList
              list={drinksSelected}
              add={this.addItem}
              remove={this.removeItem}
              category="drinks"
              openList={this.openList}
            >
              Napoje:
            </OrderCreatorList>
          </div>
          <div className="wrapper no-padding">
            <OrderCreatorList
              list={saucesSelected}
              add={this.addItem}
              remove={this.removeItem}
              category="sauces"
              openList={this.openList}
            >
              Sosy:
            </OrderCreatorList>
          </div>
        </div>
        {visibleListName && (
          <OrderSelectList
            list={this.state[visibleListName]}
            close={() => this.openList(null)}
            select={this.addItem}
            category={visibleListName}
          >
            {visibleListName}
          </OrderSelectList>
        )}
        <div className="wrapper">
          <h2>Razem:&nbsp;{this.calculateTotalPrice()}</h2>
        </div>
        <div className="wrapper centered-content">
          <MainMenuCard
            open={() => this.toggleField("isTakeAway", false)}
            additionalClasses={isTakeAway ? "grey-border" : null}
          >
            <span className={`font-icon ${isTakeAway ? "grey-font" : ""}`}>
              <FontAwesomeIcon icon={faPizzaSlice} />
            </span>
            <p>Na miejscu</p>
          </MainMenuCard>
          <MainMenuCard
            open={() => this.toggleField("isTakeAway", true)}
            additionalClasses={isTakeAway ? null : "grey-border"}
          >
            <span className={`font-icon ${!isTakeAway ? "grey-font" : ""}`}>
              <FontAwesomeIcon icon={faShoppingBag} />
            </span>
            <p>Na wynos</p>
          </MainMenuCard>
        </div>
        <div className="wrapper centered text">
          <h2>Karta stałego klienta:</h2>
          <div className="wrapper">
            {!user ? (
              <Button
                onClick={() => this.toggleField("searchPanelVisible", true)}
              >
                Wybierz
              </Button>
            ) : (
              <div>
                <div className="small-img">
                  <img src={`/uploads/users/${user.photo}`} alt={user.name} />
                </div>
                <div className="no-padding">
                  <h3>{user.name}</h3>
                  <p>
                    {user.email}
                    {user.role === "admin" && " - admin"}
                  </p>
                </div>
                <Button
                  onClick={() => this.toggleField("searchPanelVisible", true)}
                  className="small-margin"
                >
                  Zmień
                </Button>
                <Button
                  onClick={() => this.toggleField("user", null)}
                  variant="danger"
                  className="small-margin"
                >
                  Kasuj
                </Button>
              </div>
            )}
          </div>
        </div>
        <Button size="lg" onClick={this.sendOrder}>
          Przyjmij zamówienie
        </Button>
        {searchPanelVisible && (
          <Alert
            close={() => this.toggleField("searchPanelVisible", false)}
            closeBtn={true}
          >
            <h2>Wybór klienta:</h2>
            <OrderCreatorUserSelect select={this.selectUser} />
          </Alert>
        )}
        {booking && (
          <Alert close={this.resetBooking}>
            <h3>Zamówienie przyjęte</h3>
            <p>
              <a href={`/orders/view/${booking._id}`}>Przejdź do zamówienia</a>
              &nbsp;lub kliknij ok aby przyjąć nowe zamówienie.
            </p>
          </Alert>
        )}
      </div>
    );
  }
}

export default OrderCreator;
