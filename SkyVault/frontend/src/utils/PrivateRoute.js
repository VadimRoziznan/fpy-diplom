import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Loading } from "../components/Loading";

/*export const PrivateRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" />;
};*/


export const PrivateRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const isLoading = useSelector((state) => state.login.isLoading);

  console.log("PrivateRoute: isAuthenticated =", isAuthenticated, "isLoading =", isLoading);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};