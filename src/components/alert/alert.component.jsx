import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import "./alert.styles.scss";

const Alert = ({ children, close, closeBtn }) => (
  <aside className="alert-container">
    <div className="alert-wrapper">
      <div className="alert-content wrapper round-border">
        {closeBtn && (
          <span onClick={close} className="close-btn">
            <FontAwesomeIcon icon={faTimes} />
          </span>
        )}
        {children}
        {!closeBtn && (
          <span onClick={close}>
            <Button>Ok</Button>
          </span>
        )}
      </div>
    </div>
  </aside>
);

export default Alert;
