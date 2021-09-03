import React from "react";
import { Button } from "react-bootstrap";
import OrderCreatorListItem from "../order-creator-list-item/order-creator-list-item.component";

const OrderCreatorList = ({
  children,
  list,
  add,
  remove,
  openList,
  category,
}) => (
  <div className="wrapper">
    <h2>{children}</h2>
    <ul className="list">
      {list.length > 0 ? (
        list.map((item) => (
          <OrderCreatorListItem
            key={item._id}
            item={item}
            add={add}
            remove={remove}
            category={category}
          />
        ))
      ) : (
        <p>Brak elementów</p>
      )}
    </ul>
    <Button onClick={() => openList(category)}>Dodaj</Button>
  </div>
);

export default OrderCreatorList;
