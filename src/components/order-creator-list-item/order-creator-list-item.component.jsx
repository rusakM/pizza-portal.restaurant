import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import formatPrice from "../../utils/formatPrice";

const OrderCreatorListItem = ({ item, add, remove, category }) => (
  <li className="list-row container">
    <div className="wrapper round-border">
      <div className="flex-row">
        <h4>{item.name}</h4>
        <span>Cena: {formatPrice(item.price)}</span>
        <div className="flex-row auto-width">
          <Button onClick={() => add(item, -1, category)}>
            <FontAwesomeIcon icon={faMinus} />
          </Button>
          <span>{item.count}</span>
          <Button onClick={() => add(item, 1, category)}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
        <h5>Razem: {formatPrice(item.count * item.price)}</h5>
        <Button onClick={() => remove(item, category)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
      </div>
    </div>
  </li>
);

export default OrderCreatorListItem;
