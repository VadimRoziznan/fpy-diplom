import React from 'react';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Home } from './pages/Home';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StoragePage } from './pages/StoragePage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFound } from './pages/NotFoundPages';
import store from './redux/store';
import history from './utils/history';
import { PrivateRoute } from './utils/PrivateRoute';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <HistoryRouter history={history}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> 
            <Route path="/storage" element={<PrivateRoute element={<StoragePage />} />} />
            <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HistoryRouter>
    </Provider>
  );
}

export default App;