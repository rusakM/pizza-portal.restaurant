import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import formatPrice from "../../utils/formatPrice";

import OrderSelectListRow from "../order-select-list-row/order-select-list-row.component";

import "./order-select-list.styles.scss";

const OrderSelectList = ({ children, list, close, select, category }) => (
  <aside className="order-select-list container">
    <div className="wrapper round-border">
      <div className="flex-row">
        <h2>{children}</h2>
        <span className="close-btn font-icon" onClick={() => close(category)}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </div>
      <ul className="list list-scroll">
        {list.map((item) => {
          if (category === "pizzas") {
            return (
              <OrderSelectListRow item={item}>
                <div className="flex-row">
                  <Button
                    onClick={() => select(item, 1, category, "smallPizza")}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    &nbsp;24cm - {formatPrice(item.smallPizza.price)}
                  </Button>
                  <Button
                    onClick={() => select(item, 1, category, "mediumPizza")}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    &nbsp;32cm - {formatPrice(item.mediumPizza.price)}
                  </Button>
                  <Button
                    onClick={() => select(item, 1, category, "largePizza")}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    &nbsp;42cm - {formatPrice(item.largePizza.price)}
                  </Button>
                </div>
              </OrderSelectListRow>
            );
          } else {
            return (
              <OrderSelectListRow item={item}>
                <Button onClick={() => select(item, 1, category)}>
                  <FontAwesomeIcon icon={faPlus} />
                  &nbsp;{formatPrice(item.price)}
                </Button>
              </OrderSelectListRow>
            );
          }
        })}
      </ul>
    </div>
  </aside>
);
export default OrderSelectList;
