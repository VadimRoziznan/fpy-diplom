import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./CategoriesMenu.css"; // Подключаем стили

export const CategoriesMenu = ({
  onCategoryChange,
  menuList,
  defaultCategory,
}) => {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  const handleLinkClick = (title, type) => {
    setActiveCategory(type);
    onCategoryChange(type);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light navbar-cat-menu">
        <div className="container-fluid">
          {/* Кнопка для мобильного меню */}
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

          {/* Вертикальное меню */}
          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav flex-column">
              {menuList.map((item, index) => (
                <li key={index} className="nav-item">
                  <button
                    className={`nav-link text-start ${activeCategory === item.type ? "active" : ""}`}
                    onClick={() => handleLinkClick(item.title, item.type)}
                  >
                    <i className={`px-2 ${item.icon}`}></i> {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
