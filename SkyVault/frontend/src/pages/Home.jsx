import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './Home.css';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
<>

{/* Баннер*/}

<div className="banner-bg mt-5">
  <div className="container py-5">
    <div className="row mb-5 py-5 justify-content-around">
      <div className="col-md-6 py-4">
        <div className="text-start">
          <h1 className="fw-bold py-1 display-5">SkyVault Вторая память</h1>
          <h2 className="fw-bold py-1 display-5">Безопасное облачное хранилище</h2>
          <p className="py-1 fs-5">Загрузить в облако свои фото, видео и контакты<br />стало ещё проще</p>
        </div>
        <div className="d-flex justify-content-start py-4">
          <button type="button" className="btn btn-primary btn-lg w-50">Загрузить файлы</button>
        </div>
        <div className="row mb-5 py-5">
          <div className="col">
            <Link to="https://www.apple.com/app-store/">
              <img
                src="img/download-appstore.svg?v=1"
                alt="AppStore"
                className="img-fluid rounded mb-2"
              />
            </Link>
          </div>

          <div className="col">
            <Link to='https://play.google.com/store/games?hl=ru&pli=1'>
              <img
                src="img/download-google-play.svg?v=1"
                alt="Google Play"
                className="img-fluid rounded mb-2"
              />
            </Link>
          </div>
          <div className="col">
            <Link to ='https://consumer.huawei.com/ru/mobileservices/appgallery/'>
              <img
                src="img/download-appgallery.svg?v=1"
                alt="AppGallery"
                className="img-fluid rounded mb-2"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="col-md-5">
        <img
          src="img/hand@2x.webp?v=1"
          alt="hand"
          className="img-fluid rounded mb-2"
        />
      </div>
    </div>
  </div>
</div>

<div className="container py-5">

  {/* Заголовок */}

  <div className="container py-5">
    <h3 className="fw-bold">Как работает облако для хранения файлов</h3>
  </div>

    {/* Контейнер с тремя горизонтальными блоками */}

  <div className="row text-center mb-5 py-5">
    <div className="col-md-4">
      <img
        src="img/pic-safety.svg?v=1"
        alt="pic-safety"
        className="img-fluid rounded mb-2"
      />
      <h4 className='fw-bold'>Безопасно</h4>
      <p className="fs-6">Шифрует данные по<br />
        передовым технологиям.<br />
        Все файлы под защитой</p>
    </div>
    <div className="col-md-4">
      <img
        src="img/pic-reliably.svg?v=1"
        alt="pic-reliably"
        className="img-fluid rounded mb-2"
      />
      <h4 className='fw-bold'>Надёжно</h4>
      <p className="fs-6">Держит фото, видео и контакты<br />
        сразу в двух хранилищах. Ваши<br />
        данные не потеряются</p>
    </div>
    <div className="col-md-4">
      <img
        src="img/pic-for-all.svg?v=1"
        alt="pic-for-all"
        className="img-fluid rounded mb-2"
      />
      <h4  className='fw-bold'>Для всех</h4>
      <p className="fs-6">Показывает главные функции<br />
        на одном экране. Освоить<br />
        сможет каждый</p>
    </div>
  </div>

    {/* Заголовок */}

  <div className="container py-5">
    <h3  className='fw-bold'>Что умеет SkyVault Вторая память</h3>
  </div>

    {/* Первый ряд - текст слева, изображение справа */}

  <div className="row align-items-center justify-content-center mb-1 py-5">
    <div className="col-md-6">
      <h4 className="mb-2 fw-bold">Хранить телефонные книги</h4>
      <p className="small mb-1">Не теряем – даже если поменяете устройство</p>
    </div>
    <div className="col-md-4 text-center">
      <img
        src="img/phone1@2x.webp?v=1"
        alt="phone1"
        className="img-fluid rounded img-size"
      />
    </div>
  </div>

  {/* Второй ряд - изображение слева, текст справа */}
  
  <div className="row align-items-center justify-content-center mb-1 py-0 flex-md-row-reverse">
    <div className="col-md-6">
      <h4 className="mb-2 fw-bold">Восстанавливать контакты</h4>
      <p className="small mb-1">
        Бережём номера, которые вы уже удалили
      </p>
    </div>
    <div className="col-md-6 text-center">
      <img
        src="img/phone2@2x.webp?v=1"
        alt="phone2"
        className="img-fluid rounded img-size"
      />
    </div>
  </div>

  {/* Третий ряд - текст слева, изображение справа */}
  
  <div className="row align-items-center justify-content-center mb-1 py-0">
    <div className="col-md-6">
      <h4 className="mb-2 fw-bold">Освобождать место</h4>
      <p className="small mb-1">
        Загружаем фото в облако и удаляем со смартфона в одно касание
      </p>
    </div>
    <div className="col-md-4 text-center">
      <img
        src="img/phone3@2x.webp?v=1"
        alt="phone3"
        className="img-fluid rounded img-size"
      />
    </div>
  </div>
</div>
</>
  );
};