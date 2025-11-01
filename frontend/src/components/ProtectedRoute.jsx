// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useToken from '../context/token';

const ProtectedRoute = () => {
  const { tokenId } = useToken();

  return tokenId ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;