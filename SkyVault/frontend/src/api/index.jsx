export const BASE_URL = "http://127.0.0.1:8000";

/* Функция для отправки данных на сервер при авторизации */
export const fetchLoginApi = async (formData) => {
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

/* Функция для получения списка файлов */
export const fetchFilesApi = async (userId) => {
  const response = await fetch(`${BASE_URL}/storage/${userId}/`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();

  /* Убеждаемся, что data является массивом */
  const filesArray = Array.isArray(data) ? data : [data];

  return filesArray;
};

/* Функция для удаления файла */
export const deleteFileApi = async (userId, fileId) => {
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
  return response;
};

/* Функция для удаления пользователя */
export const deleteUserApi = async (userId, idToDelete) => {
  const response = await fetch(
    `${BASE_URL}/user-delete/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({userId: userId, idToDelete: idToDelete}),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to delete user with ID ${idToDelete}: ${response.statusText}`,
    );
  }
  return response;
};

/* Функция для получения списка пользователей */
export const fetchUsersApi = async (userId) => {
  const response = await fetch(`${BASE_URL}/dashboard/${userId}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

/* Функция для регистрации */
export const fetchRegisterApi = async (formData) => {
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

/* Функция для загрузки файла на сервер */
export const uploadFileApi = async (formData) => {
  const response = await fetch(
    `${BASE_URL}/user-files/${formData.get("userId")}/`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    let errorDetail = "Ошибка при загрузке файла";
    try {
      const errorResponse = await response.json();
      errorDetail = errorResponse.error || errorDetail;
    } catch (e) {
      errorDetail = await response.text();
    }
    throw new Error(errorDetail);
  }

  return await response.json();
};

/* Функция для изменения статуса пользователя */
export const changeUserStatusApi = async (userId, isStaff) => {
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

/* Функция для скачивания файлов на локальный компьютер */
export const downloadFileApi = async (fileId) => {
  const response = await fetch(`${BASE_URL}/download/${fileId}/`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  // Убеждаемся, что data является массивом
  const filesLinkArray = Array.isArray(data) ? data : [data];

  return filesLinkArray;
};

/* Функция для переименования файлов */
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


/* Функция для изменения комментария */
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

/* Функция для получения ссылки на файл */
export const fetchShareLinkApi = async ({ fileId }) => {
  console.log("getShareLinkApi fileId", fileId);
  const response = await fetch(`${BASE_URL}/get-share-link/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileId }),
  });

  if (!response.ok) {
    throw new Error(response.statusText || "Ошибка при получении ссылки");
  }

  const link = await response.text();
  return link;
};
