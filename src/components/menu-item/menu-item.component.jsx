import React from "react";

import MainMenuCard from "../main-menu-card/main-menu-card.component";
import formatPrice from "../../utils/formatPrice";

const MenuItem = ({ item, open, category }) => (
  <MainMenuCard open={open}>
    <div className="wrapper centered-content">
      <img
        className="thumbnail-item-img"
        src={`/uploads/${category}/${item.coverPhoto}`}
        alt={item._id}
      />
    </div>
    <h5>{item.name}</h5>
    <h6>{formatPrice(item.price)}</h6>
  </MainMenuCard>
);

export default MenuItem;
