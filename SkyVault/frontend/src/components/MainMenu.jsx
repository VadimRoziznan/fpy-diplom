import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/reducers/loginSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import "./MainMenu.css";

export const MainMenu = () => {
  // Получаем статус авторизации из Redux
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const userId = useSelector((state) => state.login.user?.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navLinks = [
    { to: "/", title: "SkyVault вторая память", protected: false },
    {
      to: userId ? `/storage/${userId}` : "#",
      title: "Хранилище",
      protected: true,
    },
    {
      to: userId ? `/dashboard/${userId}` : "#",
      title: "Панель Администратора",
      protected: true,
    },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/img/header-logo.jpg?v=1" alt="SkyVault" />
        </Link>
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
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto">
            {navLinks
              .filter((link) => !link.protected || isAuthenticated)
              .map((link, index) => (
                <li key={index} className="nav-item me-4">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                    to={link.to}
                  >
                    {link.title}
                  </NavLink>
                </li>
              ))}
          </ul>
          <ul className="navbar-nav ms-auto ">
            {isAuthenticated ? (
              <li className="nav-item">
                <button
                  className="btn btn-link nav-link"
                  onClick={handleLogout}
                >
                  Выход
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item me-2">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                    to="/login"
                  >
                    Вход
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
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
