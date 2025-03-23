import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";


const PrivateRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  return isAuthenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;