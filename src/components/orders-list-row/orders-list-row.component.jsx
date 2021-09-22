import React from "react";
import { formatFullDate } from "../../utils/formatDate";
import formatPrice from "../../utils/formatPrice";

const OrdersListRow = ({ item, open }) => (
  <li className="list-row">
    <div
      className="wrapper flex-row round-border"
      onClick={() => open(item._id)}
    >
      <div>
        <h4>{item.barcode}</h4>
        <p>{formatFullDate(item.createdAt)}</p>
      </div>
      <div>
        <h5>Zamawiający:</h5>
        <p>{item.user.name}</p>
        <p>{item.user.email}</p>
      </div>
      <h4>{formatPrice(item.price)}</h4>
      <div>
        <ul>
          {item.isPayNow && <li>Płatność z góry</li>}
          {item.isWithDelivery && <li>Dostawa na adres</li>}
          {item.isTakeAway && <li>Na wynos</li>}
        </ul>
      </div>
    </div>
  </li>
);

export default OrdersListRow;
