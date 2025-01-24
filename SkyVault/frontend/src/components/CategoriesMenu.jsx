import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './CategoriesMenu.css'; // Подключаем стили

export const CategoriesMenu = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState('Все файлы');

  const categoryList = [
    { title: 'Все файлы', type: 'all', icon: 'bi bi-list' },
    { title: 'Фото', type: 'photos', icon: 'bi bi-images' },
    { title: 'Документы', type: 'documents', icon: 'bi bi-file-earmark-text' },
    { title: 'Видео', type: 'videos', icon: 'bi bi-film' },
    { title: 'Музыка', type: 'music', icon: 'bi bi-music-note-beamed' },
  ];

  const handleLinkClick = (title, type) => {
    setActiveCategory(title);
    onCategoryChange(type);
  };

  console.log('activeCategory', activeCategory);

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
              {categoryList.map((category, index) => (
                <li key={index} className="nav-item">
                  <button
                    className={`nav-link text-start ${activeCategory === category.title ? 'active' : ''}`}
                    onClick={() => handleLinkClick(category.title, category.type)}
                  >
                    <i className={`px-2 ${category.icon}`}></i> {category.title}
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