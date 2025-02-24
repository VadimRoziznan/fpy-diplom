import { useEffect } from "react";
import Cookies from "js-cookie";

export const BASE_URL = "http://127.0.0.1:8000";

export const fetchLogin = async (formData) => {
  const response = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(formData),
  });

  const data = await response.json();
  return { data, status: response.status };
};

export const fetchFiles = async (userId) => {
  const response = await fetch(`${BASE_URL}/storage/${userId}/`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();

  // Убедиться, что data является массивом
  const filesArray = Array.isArray(data) ? data : [data];

  return filesArray;
};

export const fetchDeleteFile = async (userId, fileId) => {
  const response = await fetch(
    `${BASE_URL}/storage/${userId}/?file_id=${fileId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to delete file with ID ${fileId}: ${response.statusText}`,
    );
  }

  console.log("response", response);

  return response;
};

export const fetchUsers = async (userId) => {
  const response = await fetch(`${BASE_URL}/dashboard/${userId}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

export const fetchRegister = async (formData) => {
  const response = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  return { data, status: response.status };
};

// Функция для отправки файла на сервер
export const uploadFileApi = async (formData) => {
  /*await initializeCsrf(); // Инициализируем CSRF cookie перед отправкой запроса*/
  console.log("formData.get", formData.get("userId"));
  const response = await fetch(
    `${BASE_URL}/user-files/${formData.get("userId")}/`,
    {
      method: "POST",

      credentials: "include", // Включаем отправку cookie
      body: formData, // Отправляем formData напрямую
    },
  );

  if (!response.ok) {
    // Если сервер вернул ошибку, пытаемся получить текст или JSON ошибки
    let errorDetail = "Ошибка при загрузке файла";
    try {
      const errorResponse = await response.json();
      errorDetail = errorResponse.error || errorDetail; // Берем сообщение из ответа сервера
    } catch (e) {
      errorDetail = await response.text();
    }
    throw new Error(errorDetail); // Бросаем кастомное исключение с сообщением об ошибке
  }

  return await response.json(); // Успешный ответ
};

export const changeUserStatusAdmin = async (userId, isStaff) => {
  const response = await fetch(
    `${BASE_URL}/dashboard/change-status/user/${userId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_staff: isStaff }),
    },
  );

  return response;
};

export const downloadFile = async (fileId) => {
  const response = await fetch(`${BASE_URL}/download/${fileId}/`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();

  // Убедиться, что data является массивом
  const filesLinkArray = Array.isArray(data) ? data : [data];

  return filesLinkArray;
};

export const renameFileApi = async ({ userId, fileId, newName }) => {
  const response = await fetch(`${BASE_URL}/rename-file/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, fileId, newName }),
  });

  if (!response.ok) {
    throw new Error(response.statusText || "Ошибка при переименовании файла");
  }

  return response.status;
};

export const changeFileCommentApi = async ({ userId, fileId, newComment }) => {
  const response = await fetch(`${BASE_URL}/change-file-comment/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, fileId, newComment }),
  });

  if (!response.ok) {
    throw new Error(response.statusText || "Ошибка при изменении комментария");
  }

  return response.status;
};

