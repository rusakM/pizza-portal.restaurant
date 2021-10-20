import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import formatPrice from "../../utils/formatPrice";
import getIdFromPathname from "../../utils/getIdFromPathname";

class MenuCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemType: "pizza",
      ingredientsList: [],
      ingredients: [],
      price: 0,
      name: "",
      itemId: getIdFromPathname(this.props.history.location.pathname) || null,
      isNew: getIdFromPathname(this.props.history.location.pathname)
        ? true
        : false,
    };

    this.photoRef = React.createRef();
  }

  render() {
    return <div className="wrapper"></div>;
  }
}
