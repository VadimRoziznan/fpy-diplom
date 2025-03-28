# SkyVault - Облачное хранилище

## Описание проекта

"SkyVault" — это веб-приложение, работающее как облачное хранилище, позволяющее пользователям отображать, загружать, отправлять, скачивать и переименовывать файлы.

Проект включает:
- Бэкенд на Python с использованием фреймворка Django и СУБД PostgreSQL.
- Фронтенд на JavaScript с использованием React, Redux и React Router.
- Развёртывание с использованием Docker.

## Требования

Перед началом работы убедитесь, что на вашем компьютере установлены:
- Docker
- Git

## Инструкция по запуску

1. **Клонирование репозитория**
   
Склонируйте репозиторий проекта на свой компьютер.
```bash
git clone <URL_РЕПОЗИТОРИЯ>
cd <ИМЯ_ПАПКИ_ПРОЕКТА>
```
2. **Создание и настройка файла .env** 
   
Скопируйте файл .env.example в новый файл .env и отредактируйте его.
```bash
cp env_example .env
```
В файле .env необходимо указать параметры подключения к базе данных и другие конфигурации.

3. **Запуск Docker-контейнера** 
   
В корневой папке проекта выполните следующую команду для запуска контейнеров.
```bash
docker-compose up --build
```
Эта команда установит все необходимые зависимости и запустит контейнеры с приложением.


Доступ к приложению После успешного запуска контейнеров приложение будет доступно по адресу: http://localhost:3000.
Примечания
