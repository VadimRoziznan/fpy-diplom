import React , { useEffect } from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  useLocation
} from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Home } from "./pages/Home";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { StoragePage } from "./pages/StoragePage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotFound } from "./pages/NotFoundPages";
import { PrivateRoute } from "./utils/PrivateRoute";
import { UserFilesPage } from "./pages/UserFilesPage";
import store from "./redux/store";
import { checkAuthStatus } from "./redux/reducers/loginSlice"; // Импортируем checkAuthStatus

import "./App.css";
import { Loading } from "./components/Loading";


function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const isLoading = useSelector((state) => state.login.isLoading);
  const isLogoutSuccess = useSelector((state) => state.login.isLogoutSuccess);


  useEffect(() => {
    if (!isAuthenticated && !isLoading && !isLogoutSuccess) {
      console.log("Dispatching checkAuthStatus");
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated, isLogoutSuccess]);



  return (
    /*<Provider store={store}>*/
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/storage/:id"
              element={<PrivateRoute element={<StoragePage />} />}
            />
            <Route
              path="/dashboard/:id"
              element={<PrivateRoute element={<DashboardPage />} />}
            />
            <Route
              path="/user-files/:id"
              element={<PrivateRoute element={<UserFilesPage />} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    /*</Provider>*/
  );
}

export default App;
