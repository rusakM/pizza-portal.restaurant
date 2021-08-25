import React, { useEffect } from "react";
import LoadingScreen from "../loading-screen/loading-screen.component";

const Logout = ({ logout }) => {
  useEffect(() => {
    logout();
  });
  return (
    <div>
      <LoadingScreen>Trwa wylogowywanie...</LoadingScreen>
    </div>
  );
};

export default Logout;
