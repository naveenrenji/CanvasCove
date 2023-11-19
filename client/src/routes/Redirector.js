import React from "react";
import { Navigate } from "react-router-dom";

import useAuth from "../useAuth";

const Redirector = () => {
  const auth = useAuth();

  if (auth.isLoggedIn) {
    return (
      <Navigate
        to="home"
      />
    );
  }
  return <Navigate to="/welcome" />;
};

export default Redirector;
