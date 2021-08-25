import React from "react";
import { Button } from "react-bootstrap";

import "./alert.styles.scss";

const Alert = ({ children, close }) => (
  <aside className="alert-container">
    <div className="alert-wrapper">
      <div className="alert-content wrapper round-border">
        {children}
        <span onClick={close}>
          <Button>Ok</Button>
        </span>
      </div>
    </div>
  </aside>
);

export default Alert;
