/* Меню для секции рбота с файлами */
export const sectionsList = [
  { title: "Загрузить новый файл", type: "upload", icon: "bi bi-upload" },
  { title: "Скачать", type: "download", icon: "bi bi-download" },
  { title: "Переименовать файл", type: "rename", icon: "bi bi-pencil-square" },
  { title: "Изменить коментарий", type: "comment", icon: "bi bi-chat-left-text"},
  { title: "Удалить", type: "delete", icon: "bi bi-trash" },
  { title: "Поделиться ссылкой", type: "share-link", icon: "bi bi-link-45deg" },
];

/* Заголовки таблицы списка пользователей */
export const usersHeaders = [
  { name: "Имя пользователя", key: "first_name" },
  { name: "Логин пользователя", key: "username" },
  { name: "Адрес электронной почты", key: "email" },
  { name: "Количество файлов", key: "total_files" },
  { name: "Размер хранилища", key: "total_storage_size" },
  { name: "Администратор", key: "is_staff" },
];

/* Заголовки таблицы списка файлов */
export const filesHeaders = [
  { name: "Имя файла", key: "file_name" },
  { name: "Комментарий", key: "comment" },
  { name: "Размер", key: "size" },
  { name: "Дата загрузки", key: "upload_date" },
  { name: "Дата последнего скачивания", key: "last_download_date" },
];

/* Меню для администратора */
export const adminMenuList = [
  { title: "Пользователи", type: "users", icon: "bi bi-people" },
  { title: "Документация", type: "documentation", icon: "bi bi-journal-text" },
  { title: "Объём хранилища", type: "capacity", icon: "bi bi-bar-chart-line" },
  { title: "Тарифы и подписки", type: "tariffs", icon: "bi bi-card-text" },
  { title: "Логи событий", type: "logs", icon: "bi bi-file-earmark-text" },
];

/* Меню для выбора категорий */
export const storageMenuList = [
  { title: "Все файлы", type: "all", icon: "bi bi-list" },
  { title: "Фото", type: "photos", icon: "bi bi-images" },
  { title: "Документы", type: "documents", icon: "bi bi-file-earmark-text" },
  { title: "Видео", type: "videos", icon: "bi bi-film" },
  { title: "Музыка", type: "music", icon: "bi bi-music-note-beamed" },
];

