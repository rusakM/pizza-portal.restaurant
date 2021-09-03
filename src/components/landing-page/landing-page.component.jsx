import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faPizzaSlice,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

import MainMenuCard from "../main-menu-card/main-menu-card.component";

const LandingPage = ({ history }) => {
  return (
    <div className="wrapper">
      <div className="landing-page-cards">
        <MainMenuCard open={() => history.push("/orders/create")}>
          <span className="font-icon">
            <FontAwesomeIcon icon={faPlusCircle} />
          </span>
          <p>Stwórz zamówienie</p>
        </MainMenuCard>
        <MainMenuCard open={() => history.push("/orders/new")}>
          <span className="font-icon">
            <FontAwesomeIcon icon={faPizzaSlice} />
          </span>
          <p>Nowe zamówienia</p>
        </MainMenuCard>
        <MainMenuCard open={() => history.push("/statistics")}>
          <span className="font-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </span>
          <p>Statystyki</p>
        </MainMenuCard>
      </div>
    </div>
  );
};

export default LandingPage;
