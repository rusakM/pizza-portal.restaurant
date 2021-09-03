import React from "react";
import "./main-menu-card.styles.scss";

const MainMenuCard = ({ children, open, additionalClasses }) => (
  <div className="main-menu-card">
    <div
      className={`${
        additionalClasses ?? ""
      } wrapper round-border centered-content main-menu-card-wrapper`}
      onClick={open}
    >
      {children}
    </div>
  </div>
);

export default MainMenuCard;
