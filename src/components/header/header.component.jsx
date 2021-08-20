import React from "react";
import HeaderItem from "../header-item/header-item.component";
import { ReactComponent as Pizza } from "../../svg/pizza.svg";

import "./header.styles.scss";

const Header = ({ history }) => (
  <header>
    <div className="header-logo" onClick={() => history.push("/")}>
      <Pizza />
    </div>
    <HeaderItem link="/orders">Zamówienia</HeaderItem>
    <HeaderItem link="/messages">Wiadomości</HeaderItem>
    <HeaderItem link="/menu">Menu</HeaderItem>
    <HeaderItem link="/logout">Wyloguj</HeaderItem>
  </header>
);

export default Header;
