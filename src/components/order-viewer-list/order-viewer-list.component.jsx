import React from "react";
import formatPrice from "../../utils/formatPrice";
const OrderViewerList = ({ children, items }) => (
  <div className="wrapper">
    <h2>{children}</h2>
    <ul className="list">
      {items.map((item) => (
        <li className="list-row container" key={item._id}>
          <div className="wrapper round-border">
            <div className="flex-row">
              <h5>{item.name}</h5>
              <p>Ilość:&nbsp;{item.quantity}</p>
              <p>Cena (szt):&nbsp;{formatPrice(item.price)}</p>
              <p>Razem:&nbsp;{formatPrice(item.totalAmount)}</p>
            </div>
            {item.description && <p>{item.description}</p>}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default OrderViewerList;
