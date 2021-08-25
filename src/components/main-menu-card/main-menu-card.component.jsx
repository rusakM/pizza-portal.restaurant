import React from "react";
import "./main-menu-card.styles.scss";

const MainMenuCard = ({ children, open }) => (
  <div className="main-menu-card">
    <div
      className="wrapper round-border centered-content main-menu-card-wrapper"
      onClick={open}
    >
      {children}
    </div>
  </div>
);

export default MainMenuCard;
