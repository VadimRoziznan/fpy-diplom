export const validatePassword = (password) => {
  const regex = /(?=.*[0-9])(?=.*[!@#$%^&*></?}~`'"-+,.:;])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g;
  return regex.test(password);
};

export const validateLogin = (password) => {
  const regex = /^[A-Z][0-9a-zA-Z]{3,19}$/;
  return regex.test(password);
};

export const GenerateIconWithFileName = ({ fileName, link }) => {

  const fileIcons = {
    // Документы
    pdf: 'bi-file-earmark-pdf', // PDF
    doc: 'bi-file-earmark-word', // Microsoft Word
    docx: 'bi-file-earmark-word',
    xls: 'bi-file-earmark-excel', // Microsoft Excel
    xlsx: 'bi-file-earmark-excel',
    ppt: 'bi-file-earmark-ppt', // Microsoft PowerPoint
    pptx: 'bi-file-earmark-ppt',
    txt: 'bi-file-earmark-text', // Текстовые файлы
    rtf: 'bi-file-earmark-richtext', // Rich Text Format
  
    // Изображения
    jpg: 'bi-file-earmark-image', // Изображения
    jpeg: 'bi-file-earmark-image',
    png: 'bi-file-earmark-image',
    gif: 'bi-file-earmark-image',
    bmp: 'bi-file-earmark-image',
    svg: 'bi-file-earmark-image',
  
    // Аудио
    mp3: 'bi-file-earmark-music', // Аудиофайлы
    wav: 'bi-file-earmark-music',
    aac: 'bi-file-earmark-music',
    flac: 'bi-file-earmark-music',
  
    // Видео
    mp4: 'bi-file-earmark-play', // Видеофайлы
    avi: 'bi-file-earmark-play',
    mkv: 'bi-file-earmark-play',
    mov: 'bi-file-earmark-play',
  
    // Архивы
    zip: 'bi-file-earmark-zip', // Архивные файлы
    rar: 'bi-file-earmark-zip',
    tar: 'bi-file-earmark-zip',
    gz: 'bi-file-earmark-zip',
  
    // Код
    js: 'bi-file-earmark-code', // JavaScript
    html: 'bi-file-earmark-code', // HTML
    css: 'bi-file-earmark-code', // CSS
    json: 'bi-file-earmark-code', // JSON
  
    // Иконка по умолчанию
    default: 'bi-file-earmark', // Для всех остальных типов
  };
  
  const getFileIcon = (extension) => fileIcons[extension] || fileIcons.default;

  const extension = fileName.split('.').pop().toLowerCase(); // Получаем расширение файла
  const iconClass = getFileIcon(extension); // Получаем соответствующую иконку

  return (
    <>
    <div className="file-item d-flex align-items-center">
      {/*<a href={link} download={fileName}>*/}
      <i className={`bi ${iconClass} me-2`} style={{ fontSize: '3rem' }}></i>
      <span>{fileName}</span> {/* Имя файла */}
     {/*</a>*/}
    </div>
    </>
  );
};