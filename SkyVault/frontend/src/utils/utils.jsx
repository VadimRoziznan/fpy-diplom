/* Проверка пароля */
export const validatePassword = (password) => {
  const regex =
    /(?=.*[0-9])(?=.*[!@#$%^&*></?}~`'"-+,.:;])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g;
  return regex.test(password);
};

/* Проверка логина */
export const validateLogin = (password) => {
  const regex = /^[A-Z][0-9a-zA-Z]{3,19}$/;
  return regex.test(password);
};

/* Функция для генерации иконок по расширению файла */
export const GenerateIconWithFileName = ({ fileName, link }) => {
  const fileIcons = {
    // Документы
    pdf: "bi-file-earmark-pdf", // PDF
    doc: "bi-file-earmark-word", // Microsoft Word
    docx: "bi-file-earmark-word",
    xls: "bi-file-earmark-excel", // Microsoft Excel
    xlsx: "bi-file-earmark-excel",
    ppt: "bi-file-earmark-ppt", // Microsoft PowerPoint
    pptx: "bi-file-earmark-ppt",
    txt: "bi-file-earmark-text", // Текстовые файлы
    rtf: "bi-file-earmark-richtext", // Rich Text Format

    // Изображения
    jpg: "bi-file-earmark-image", // Изображения
    jpeg: "bi-file-earmark-image",
    png: "bi-file-earmark-image",
    gif: "bi-file-earmark-image",
    bmp: "bi-file-earmark-image",
    svg: "bi-file-earmark-image",

    // Аудио
    mp3: "bi-file-earmark-music", // Аудиофайлы
    wav: "bi-file-earmark-music",
    aac: "bi-file-earmark-music",
    flac: "bi-file-earmark-music",

    // Видео
    mp4: "bi-file-earmark-play", // Видеофайлы
    avi: "bi-file-earmark-play",
    mkv: "bi-file-earmark-play",
    mov: "bi-file-earmark-play",

    // Архивы
    zip: "bi-file-earmark-zip", // Архивные файлы
    rar: "bi-file-earmark-zip",
    tar: "bi-file-earmark-zip",
    gz: "bi-file-earmark-zip",

    // Код
    js: "bi-file-earmark-code", // JavaScript
    html: "bi-file-earmark-code", // HTML
    css: "bi-file-earmark-code", // CSS
    json: "bi-file-earmark-code", // JSON

    // Пользователи
    user: "bi-person", // Иконка для пользователей

    // Иконка по умолчанию
    default: "bi-file-earmark", // Для всех остальных типов
  };

  const getFileIcon = (extension) => fileIcons[extension] || fileIcons.default;

  // Проверяем, передано ли имя файла или имя пользователя
  const isUser = !fileName.includes("."); // Если в имени нет точки, считаем, что это имя пользователя
  const iconClass = isUser
    ? fileIcons.user
    : getFileIcon(fileName.split(".").pop().toLowerCase());

  return (
    <>
      <i className={`bi ${iconClass} me-2`} style={{ fontSize: "3rem" }}></i>
      <span>{fileName}</span> {/* Имя файла или пользователя */}
    </>
  );
};

/* Функция для определения типа файла */
export function getFileType(fileName) {
  // Список расширений для каждого типа файлов
  const fileTypes = {
    photos: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"],
    documents: [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "txt",
      "odt",
      "rtf",
      "csv",
      "pub",
      "log",
    ],
    videos: ["mp4", "avi", "mov", "mkv", "flv", "wmv", "webm", "3gp"],
    music: ["mp3", "wav", "flac", "aac", "ogg", "m4a", "wma"],
  };

  // Извлекаем расширение файла
  const parts = fileName.split(".");
  const extension = parts.length > 1 ? parts.pop().toLowerCase() : ""; // Получаем последнее расширение (если есть)

  // Проверяем к какому типу относится расширение
  for (const [type, extensions] of Object.entries(fileTypes)) {
    if (extensions.includes(extension)) {
      return type;
    }
  }

  // Если тип не найден, относим файл к "documents"
  return "documents";
}
