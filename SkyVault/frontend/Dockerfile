# Используем официальное изображение Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY package.json package-lock.json ./

# Устанавливаем зависимости с очисткой кэша npm
RUN npm cache clean --force && npm install --verbose

# Проверяем, что react-scripts установлен (для отладки)
RUN npm list react-scripts || echo "react-scripts not found"

# Копируем исходный код проекта
COPY . .

# Открываем порт 3000
EXPOSE 3000

# Запуск React приложения
CMD ["npm", "start"]