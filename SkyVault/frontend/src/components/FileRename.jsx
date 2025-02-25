import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  renameFileRequest,
  renameFileFailure,
} from "../redux/reducers/fileManagerSlice";
import Swal from "sweetalert2";

/* Компонент для переименования файлов */
const FileRename = ({ fileId, userId, onClose }) => {
  const [newName, setNewName] = useState("");
  const dispatch = useDispatch();

  /* Функция для переименования файлов */
  const handleRename = async () => {
    try {
      dispatch(renameFileRequest({ userId, fileId, newName }))
      onClose();
    } catch (error) {
      dispatch(renameFileFailure(error.message));
      Swal.fire({
        icon: "error",
        title: "Ошибка при попытке переименовать файл",
        text:
          error.message || "Произошла неизвестная ошибка. Попробуйте снова.",
      });
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Переименовать файл</h5>
          </div>
          <div className="modal-body">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Введите новое имя файла"
              className="form-control"
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Закрыть
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRename}
            >
              Переименовать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileRename;
