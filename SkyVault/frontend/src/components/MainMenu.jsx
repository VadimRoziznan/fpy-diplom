import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './MainMenu.css';

export const MainMenu = () => {
  // Состояние для отслеживания авторизации пользователя
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Основные ссылки меню
  const navLinks = [
    { to: '/', title: 'SkyVault вторая память', protected: false },
    { to: '/storage', title: 'Хранилище', protected: true }, // Только для авторизованных
    { to: '/dashboard', title: 'Панель Администратора', protected: true }, // Только для авторизованных
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Логотип */}
        <Link className="navbar-brand" to="/">
          <img src="/img/header-logo.jpg?v=1" alt="SkyVault" />
        </Link>

        {/* Кнопка-гамбургер для мобильных устройств */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Основное меню */}
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto">
            {navLinks
              .filter((link) => !link.protected || isAuthenticated) // Показывать только незащищенные ссылки или при авторизации
              .map((link, index) => (
                <li key={index} className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    to={link.to}
                  >
                    {link.title}
                  </NavLink>
                </li>
              ))}
          </ul>

          {/* Блок входа/выхода */}
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>
                  Выход
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    to="/login"
                  >
                    Вход
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    to="/register"
                  >
                    Регистрация
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};