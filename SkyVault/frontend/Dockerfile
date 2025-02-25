# Используем официальное изображение Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY package.json package-lock.json ./
RUN npm install

# Копируем исходный код проекта
COPY . .

# Открываем порт 3000
EXPOSE 3000

# Запуск React приложения
CMD ["npm", "start"]