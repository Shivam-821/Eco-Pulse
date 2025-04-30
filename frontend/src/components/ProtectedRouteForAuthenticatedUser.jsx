import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRouteForAuthenticatedUser() {

  const isLoggedIn = localStorage.getItem("accessToken");
  return isLoggedIn ? (
    <Navigate to="/" replace />
  ) : (
    <Navigate to="/auth" replace />
  );

}

export default ProtectedRouteForAuthenticatedUser;
