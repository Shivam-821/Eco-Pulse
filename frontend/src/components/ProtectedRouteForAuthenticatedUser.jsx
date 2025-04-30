import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouteForAuthenticatedUser = ({ children }) => {
  const isLoggedIn = localStorage.getItem("accessToken");

  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

export default ProtectedRouteForAuthenticatedUser;
