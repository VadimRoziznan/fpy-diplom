# Укажите базовый образ
FROM python:3.10-slim

# Установите рабочую директорию внутри контейнера
WORKDIR /app

# Скопируйте файлы проекта в контейнер
COPY . /app

# Установите зависимости
RUN pip install --no-cache-dir -r /app/requirements.txt

# Установите рабочую директорию для Django
WORKDIR /app/SkyVault

# Укажите команду по умолчанию
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
