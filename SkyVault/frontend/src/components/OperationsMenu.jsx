import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteFileRequest,
  downloadFileRequest,
  shareLinkRequest,
} from "../redux/reducers/fileManagerSlice";
import "./OperationsMenu.css";
import { FileUpload } from "./FileUpload";
import {
  uploadFileSuccess,
  uploadFileFailure,
  deleteFileFailure,
} from "../redux/reducers/fileManagerSlice";
import { deleteUserRequest, deleteUserFailure } from "../redux/reducers/userManagementSlice";
import { uploadFileApi } from "../api";
import { getFileType } from "../utils/utils";
import Swal from "sweetalert2";
import FileRename from "./FileRename";
import FileChangeComment from "./FileChangeComment";

/* Компонент меню операций */
export const OperationsMenu = ({
  userId,
  checkedFiles,
  setCheckedFiles,
  sectionsList,
  userDelete=false,
  allowedMenuItems=["all"],
}) => {
  const [sectionType, setSectionType] = useState("");
  const dispatch = useDispatch();

  /* Фильтрация меню, в случае если allowedMenuItems равен "all" используется все меню */
  if (!allowedMenuItems.includes("all")) {
    sectionsList = sectionsList.filter((section) => allowedMenuItems.includes(section.type));
  }

  /* Обработчик нажатия на кнопку */
  const handleClick = (actionType, listWithIds, userId) => {
    if (
      ["delete", "download", "rename", "comment", "share-link"].includes(
        actionType,
      ) &&
      checkedFiles.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Нет выбранных файлов",
        text: "Пожалуйста, выберите файл для выполнения действия.",
      });
      return;
    }

    setSectionType(actionType); // Открытие модального окна

    /* Удаление файлов */
    if (actionType === "delete" && !userDelete) {
      for (const fileIdToDelete of listWithIds) {
        try {
          dispatch(deleteFileRequest({ userId, fileIdToDelete }));
        } catch (error) {
          dispatch(deleteFileFailure(error.message));
          console.error(`Ошибка при удалении файла ${fileIdToDelete}:`, error);
        }
      }
    }
    /* Удаление пользователей */
    if (actionType === "delete" && userDelete) {
      const listUsersIdToDelete = listWithIds // Список пользователей для удаления
      for (const userIdToDelete of listUsersIdToDelete) {
        try {
          dispatch(deleteUserRequest({ userId, userIdToDelete }));
        } catch (error) {
          dispatch(deleteUserFailure(error.message));
          console.error(`Ошибка при удалении пользователя с id №${userIdToDelete}:`, error);
        }
      }
    }

    /* Скачивание файлов на локальный компьютер */
    if (actionType === "download") {
      dispatch(downloadFileRequest(listWithIds));
    }

    /* Поделиться ссылкой */
    if (actionType === "share-link") {
      dispatch(shareLinkRequest(listWithIds[0]));
    }
  };

  /* Обработчик загрузки файлов на сервер */
  const handleUpload = async (file, comment, userId) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("comment", comment);
      formData.append("userId", userId);
      formData.append("type", getFileType(file.name));
      formData.append("file_name", file.name);

      // Отправляем файл напрямую через API
      const response = await uploadFileApi(formData);

      // Диспатчим результат загрузки
      dispatch(uploadFileSuccess(response));
      Swal.fire({
        icon: "success",
        title: "Файл успешно загружен!",
        text: "Ваш файл был успешно загружен на сервер.",
      });
    } catch (error) {
      dispatch(uploadFileFailure(error.message));
      Swal.fire({
        icon: "error",
        title: "Ошибка загрузки файла",
        text:
          error.message || "Произошла неизвестная ошибка. Попробуйте снова.",
      });
    }
  };

  /* Обработчик закрытия модального окна */
  const handleCloseModal = () => {
    setSectionType(""); // Закрыть модальное окно
    setCheckedFiles([]); // Очистка выбранных файлов
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
                    tabIndex={0}
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
      {/* Показываем модальное окно, если выбрано действие "rename" */}
      {sectionType === "rename" && (
        <FileRename
          userId={userId}
          fileId={checkedFiles[0]}
          onClose={handleCloseModal}
        />
      )}
      {/* Показываем модальное окно, если выбрано действие "comment" */}
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
