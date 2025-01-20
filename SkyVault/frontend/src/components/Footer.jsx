import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './Footer.css';


export const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row text-center">
          <div className="col-md-4">
            <h5 className="fw-bold">О нас</h5>
            <p className="text-start">SkyVault — это умный облачный сервис. В нём можно хранить фото, видео, документы и контакты. Умеет загружать файлы автоматически и хранит их на защищённых серверах.</p>
          </div>
          <div className="col-md-4">
            <h5 className="fw-bold">Контакты</h5>
            <ul className="list-unstyled">
              <li><a href="mailto:support@skyvault.com" className="text-white text-decoration-none">support@skyvault.com</a></li>
              <li><a href="tel:+79817514877" className="text-white text-decoration-none">+7 (981) 751-48-77</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5 className="fw-bold">Соцсети</h5>
            <div className="d-flex justify-content-center">
              <a href="https://facebook.com" className="text-white mx-2 text-decoration-none"><i className="bi bi-facebook"></i> Facebook</a>
              <a href="https://twitter.com" className="text-white mx-2 text-decoration-none"><i className="bi bi-twitter"></i> Twitter</a>
              <a href="https://instagram.com" className="text-white mx-2 text-decoration-none"><i className="bi bi-instagram"></i> Instagram</a>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center text-start mt-4">
          <p className="mb-0">&copy; 2025 SkyVault. Проект не предназначен для коммерческого применения<br/> 
          и является проектной работой для закрепления теоретических знаний<br/> 
          полученных в процессе обучения.</p>
        </div>
      </div>
    </footer>
  );
};