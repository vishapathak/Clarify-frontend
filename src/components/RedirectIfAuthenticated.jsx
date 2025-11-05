import React from "react";
import { Navigate } from "react-router-dom";

const RedirectIfAuthenticated = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
