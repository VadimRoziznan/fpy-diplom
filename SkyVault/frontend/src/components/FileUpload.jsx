import React, { useState } from "react";
import "./FileUpload.css";

/* Компонент для загрузки файлов */
export const FileUpload = ({ userId, onUpload, onClose }) => {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");

  /* Обработчик изменения файла */
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  /* Обработчик изменения комментария */
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  /* Обработчик отправки формы */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file, comment, userId); // Передаем файл и комментарий в обработчик
      onClose(); // Закрываем форму после успешной отправки
    } else {
      alert("Выберите файл для загрузки.");
    }
  };

  return (
    <div className="file-upload-overlay">
      <div className="file-upload-modal">
        <button className="file-upload-close" onClick={onClose}>
          &times;
        </button>
        <form onSubmit={handleSubmit} className="file-upload-form">
          <div className="mb-3">
            <label htmlFor="fileInput" className="form-label">
              Выберите файл:
            </label>
            <input
              type="file"
              id="fileInput"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="commentInput" className="form-label">
              Комментарий:
            </label>
            <textarea
              id="commentInput"
              className="form-control"
              value={comment}
              onChange={handleCommentChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Загрузить
          </button>
        </form>
      </div>
    </div>
  );
};
