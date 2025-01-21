// PrivateRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  console.log('isAuthenticated', isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

