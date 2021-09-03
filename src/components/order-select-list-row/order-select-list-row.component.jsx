import React from "react";

import "./order-select-list-row.styles.scss";

const OrderSelectListRow = ({ children, item }) => (
  <li className="list-row container">
    <div className="flex-row wrapper">
      <h4>{item.name}</h4>
      <div>{children}</div>
    </div>
  </li>
);

export default OrderSelectListRow;
