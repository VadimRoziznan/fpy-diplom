import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  deleteFileRequest,
  downloadFileRequest,
} from "../redux/reducers/fileManagerSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./OperationsMenu.css";
import { FileUpload } from "./FileUpload";
import {
  uploadFileSuccess,
  uploadFileFailure,
  fetchFilesRequest,
  deleteFileSuccess,
  deleteFileFailure,
} from "../redux/reducers/fileManagerSlice";
import { uploadFileApi } from "../api";
import { getFileType } from "../utils/utils";
import Swal from "sweetalert2";
import FileRename from "./FileRename";
import FileChangeComment from "./FileChangeComment";
import { debounce } from 'lodash';

export const OperationsMenu = ({
  userId,
  checkedFiles,
  setCheckedFiles,
  sectionsList,
  onRefreshData,
}) => {
  /*const userId = useSelector((state) => state.login.user?.id);*/
  const [sectionType, setSectionType] = useState("");
  const [updateFiles, setUpdateFiles] = useState(false);
  /*const { data } = useSelector((state) => state.data);*/
  const dispatch = useDispatch();

  /*useEffect(() => {
    if (updateFiles) {
      dispatch(fetchFilesRequest(userId));
      setUpdateFiles(false);
    }
  }, [updateFiles, userId, dispatch]);*/

  const handleClick = (actionType, FileIds, userId) => {
    if (
      ["delete", "download", "rename", "comment", "share-link"].includes(actionType) &&
      checkedFiles.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Нет выбранных файлов",
        text: "Пожалуйста, выберите файл для выполнения действия.",
      });
      return;
    }
    setSectionType(actionType);

    if (actionType === "delete") {
      for (const fileId of FileIds) {
        try {
          dispatch(deleteFileRequest({ userId, fileId }));
          dispatch(deleteFileSuccess(fileId)); // Удаление из Redux
        } catch (error) {
          dispatch(deleteFileFailure(error.message)); // Логируем ошибку
          console.error(`Ошибка при удалении файла ${fileId}:`, error);
        }
      }
      setUpdateFiles(true);
    }

    if (actionType === "download") {
      dispatch(downloadFileRequest(FileIds));
      setUpdateFiles(true);
      onRefreshData();
    }

    if (actionType === "upload") {
      setSectionType("upload");
    }

    if (actionType === "comment") {
      setSectionType("comment");
    }

    if (actionType === "rename") {
      setSectionType("rename");
    }
  };

  const handleUpload = async (file, comment, userId) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("comment", comment);
      formData.append("userId", userId);
      formData.append("type", getFileType(file.name)); // Доработать определение типа
      formData.append("file_name", file.name);

      // Отправляем файл напрямую через API
      const response = await uploadFileApi(formData);

      // Диспатчим только результат загрузки (например, успешный ответ от сервера)
      dispatch(uploadFileSuccess(response));
      // Показываем сообщение об успешной загрузке
      Swal.fire({
        icon: "success",
        title: "Файл успешно загружен!",
        text: "Ваш файл был успешно загружен на сервер.",
      });
    } catch (error) {
      // Диспатчим ошибку в Redux
      dispatch(uploadFileFailure(error.message));

      // Показываем ошибку пользователю через Swal
      Swal.fire({
        icon: "error",
        title: "Ошибка загрузки файла",
        text:
          error.message || "Произошла неизвестная ошибка. Попробуйте снова.",
      });
    }
  };

  const handleCloseModal = () => {
    setSectionType(""); // Закрыть модальное окно
    setCheckedFiles([]); // Очистка выбранных файлов
    setUpdateFiles(true); // Обновление списка файлов
    onRefreshData(); // Обновление списка файлов
  };

  return (
    <div className="d-flex flex-wrap justify-content-start ">
      <nav className="navbar navbar-expand-lg navbar-costume">
        <div className="сontainer ">
          {/* Горизонтальное меню */}
          <div className="collapse navbar-collapse show " id="navbarMain ">
            <ul className="navbar-nav flex-row ">
              {sectionsList.map((section, index) => (
                <li key={index} className="nav-item ">
                  <i
                    className={`px-4 fs-4 title-icon ${section.icon}`}
                    role="button" // Указываем, что элемент работает как кнопка
                    tabIndex={0} // Делает элемент фокусируемым
                    title={section.title}
                    onClick={() =>
                      handleClick(section.type, checkedFiles, userId)
                    }
                  ></i>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      {/* Показываем модальное окно, если выбрано действие "upload" */}
      {sectionType === "upload" && (
        <FileUpload
          userId={userId}
          onUpload={handleUpload}
          onClose={handleCloseModal}
        />
      )}
      {sectionType === "rename" && (
        <FileRename
          userId={userId}
          fileId={checkedFiles[0]}
          onClose={handleCloseModal}
        />
      )}
      {sectionType === "comment" && (
        <FileChangeComment
          userId={userId}
          fileId={checkedFiles[0]}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
