import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, resetLogoutSuccess } from "../redux/reducers/loginSlice";
import "./MainMenu.css";

/* Компонент главного меню */
export const MainMenu = () => {
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const isLogoutSuccess = useSelector((state) => state.login.isLogoutSuccess);
  const userId = useSelector((state) => state.login.user?.id);
  const user = useSelector((state) => state.login?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Флаг для предотвращения повторных кликов

  /* Обработчик выхода */
  const handleLogout = () => {
    if (!isLoggingOut && isAuthenticated) { // Добавляем проверку isAuthenticated
      console.log("Dispatching logout");
      setIsLoggingOut(true); // Устанавливаем флаг, чтобы предотвратить повторные клики
      dispatch(logout());
    }
  };

  // Перенаправление после успешного выхода
  useEffect(() => {
    if (isLogoutSuccess) {
      console.log("Logout successful, redirecting to /login");
      navigate("/login", { replace: true }); // Используем replace для предотвращения возврата назад
      dispatch(resetLogoutSuccess()); // Сбрасываем флаг
      setIsLoggingOut(false); // Сбрасываем флаг после перенаправления
    }
  }, [isLogoutSuccess, navigate, dispatch]);


  /* Главное меню */
  const navLinks = [
    { title: "SkyVault вторая память", to: "/", protected: false },
    { title: "Хранилище", to: user?.id ? `/storage/${user?.id}` : "#", protected: true },
    { title: "Панель Администратора", to: user?.id ? `/dashboard/${user?.id}` : "#", protected: true, adminOnly: true },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img 
            src={`${process.env.PUBLIC_URL}/img/header-logo.jpg?v=1`}
            alt="SkyVault" />
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
              .filter((link) => {
                /* Если маршрут не защищён, показываем его всегда */
                if (!link.protected) return true;
                /* Если пользователь не авторизован, скрываем защищённые маршруты */
                if (!isAuthenticated) return false;
                /* Если маршрут только для администраторов, проверяем роль */
                if (link.adminOnly) return user?.role === true;
                /* Для всех остальных защищённых маршрутов достаточно авторизации */
                return true;
              })
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
              <>
                <li className="nav-item">
                <span
                  className="nav-link"
                >
                  {user.first_name}
                </span>
              </li>
              <span className="divider"></span>
              <li className="nav-item">
                <button
                  className="btn btn-link nav-link"
                  onClick={handleLogout}
                >
                  Выход
                </button>
              </li>
              </>
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
