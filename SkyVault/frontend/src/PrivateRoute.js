import React, { useContext } from 'react';
import { Route, Redirect, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { AuthContext } from './AuthContext';
import { Loading } from './components/Loading';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const isLoading = useSelector((state) => state.login.isLoading);



  return isAuthenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;