export const BASE_URL = "http://127.0.0.1:8000";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

/* Функция для отправки данных на сервер при авторизации */
export const fetchLoginApi = async (formData) => {
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  const response = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // Добавляем CSRF-токен
    },
    credentials: 'include', // Включаем отправку куки
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  return { data, status: response.status };
};

/* Функция для получения списка файлов */
export const fetchFilesApi = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/storage/${userId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Включаем отправку куки
  });

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
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  const response = await fetch(
    `${BASE_URL}/api/storage/${userId}/?file_id=${fileId}`,
    {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        "X-CSRFToken": csrfToken, // Добавляем CSRF-токен
      },
    credentials: 'include', // Включаем отправку куки
    });
  if (!response.ok) {
    throw new Error(
      `Failed to delete file with ID ${fileId}: ${response.statusText}`,
    );
  }
  return response;
};

/* Функция для удаления пользователя */
export const deleteUserApi = async (userId, idToDelete) => {
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  const response = await fetch(
    `${BASE_URL}/api/user-delete/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // Добавляем CSRF-токен
      },
    credentials: 'include', // Включаем отправку куки
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
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  const response = await fetch(`${BASE_URL}/api/dashboard/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "X-CSRFToken": csrfToken, // Добавляем CSRF-токен
    },
    credentials: 'include', // Включаем отправку куки
  });
  console.log(response)
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

/* Функция для регистрации */
export const fetchRegisterApi = async (formData) => {
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  const response = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // Добавляем CSRF-токен
    },
    credentials: 'include', // Включаем отправку куки
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  return { data, status: response.status };
};

/* Функция для загрузки файла на сервер */
export const uploadFileApi = async (formData) => {
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  const response = await fetch(
    `${BASE_URL}/api/user-files/${formData.get("userId")}/`,
    {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrfToken, // Добавляем CSRF-токен
      },
    credentials: 'include', // Включаем отправку куки
    });

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
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  const response = await fetch(
    `${BASE_URL}/api/dashboard/change-status/user/${userId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // Добавляем CSRF-токен
      },
    credentials: 'include', // Включаем отправку куки
      body: JSON.stringify({ is_staff: isStaff }),
    },
  );

  return response;
};

/* Функция для скачивания файлов на локальный компьютер */
export const downloadFileApi = async (fileId) => {
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  const response = await fetch(`${BASE_URL}/api/download/${fileId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "X-CSRFToken": csrfToken, // Добавляем CSRF-токен
    },
    credentials: 'include', // Включаем отправку куки
  });
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
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  const response = await fetch(`${BASE_URL}/api/rename-file/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // Добавляем CSRF-токен
    },
    credentials: 'include', // Включаем отправку куки
    body: JSON.stringify({ userId, fileId, newName }),
  });

  if (!response.ok) {
    throw new Error(response.statusText || "Ошибка при переименовании файла");
  }

  return response.status;
};


/* Функция для изменения комментария */
export const changeFileCommentApi = async ({ userId, fileId, newComment }) => {
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  const response = await fetch(`${BASE_URL}/api/change-file-comment/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // Добавляем CSRF-токен
    },
    credentials: 'include', // Включаем отправку куки
    body: JSON.stringify({ userId, fileId, newComment }),
  });

  if (!response.ok) {
    throw new Error(response.statusText || "Ошибка при изменении комментария");
  }

  return response.status;
};

/* Функция для получения ссылки на файл */
export const fetchShareLinkApi = async ({ fileId }) => {
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  const response = await fetch(`${BASE_URL}/api/get-share-link/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // Добавляем CSRF-токен
    },
    credentials: 'include', // Включаем отправку куки
    body: JSON.stringify({ fileId }),
  });

  if (!response.ok) {
    throw new Error(response.statusText || "Ошибка при получении ссылки");
  }

  const link = await response.text();
  return link;
};

/* Функция для проверки текущей сессии */
export const checkSessionApi = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/session/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch session: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking session:", error);
    throw error;
  }
};

export const logoutApi = async () => {
  const csrfToken = getCookie('csrftoken'); // Извлекаем CSRF-токен
  try {
    const response = await fetch(`${BASE_URL}/api/auth/logout/`, {
      method: "POST",
      credentials: "include", // Включаем куки для сессии
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // Если требуется CSRF-токен
      },
    });

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};
