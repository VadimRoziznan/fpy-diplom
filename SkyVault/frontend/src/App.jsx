import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import './App.css';

function App() {
  return (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Layout>
  </BrowserRouter>
  );
}

export default App;