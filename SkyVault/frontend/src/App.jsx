import React from "react";
import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { Provider } from "react-redux";
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
import "./App.css";

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
