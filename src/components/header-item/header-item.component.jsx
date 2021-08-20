import React from "react";

import "./header-item.styles.scss";

const HeaderItem = ({ children, link }) => (
  <div className="header-item">
    <a href={link}>{children}</a>
  </div>
);

export default HeaderItem;
