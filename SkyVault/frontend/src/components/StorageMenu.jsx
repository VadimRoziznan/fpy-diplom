import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './StorageMenu.css'; // Подключаем стили

export const StorageMenu = ({ onCategoryChange }) => {
  const [activeLink, setActiveLink] = useState('all');

  const categoryList = [
    { title: 'Все файлы', type: 'all', icon: 'bi bi-list' },
    { title: 'Фото', type: 'photos', icon: 'bi bi-images' },
    { title: 'Документы', type: 'documents', icon: 'bi bi-file-earmark-text' },
    { title: 'Видео', type: 'videos', icon: 'bi bi-film' },
    { title: 'Музыка', type: 'music', icon: 'bi bi-music-note-beamed' },
  ];

  const handleLinkClick = (title, type) => {
    setActiveLink(title);
    onCategoryChange(type);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light">
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
              {categoryList.map((link, index) => (
                <li key={index} className="nav-item">
                  <button
                    className={`nav-link text-start ${activeLink === link.title ? 'active' : ''}`}
                    onClick={() => handleLinkClick(link.title, link.type)}
                  >
                    <i className={`px-2 ${link.icon}`}></i> {link.title}
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