// authSaga.js

import { call, put, takeLatest } from "redux-saga/effects";
import { fetchLoginSuccess, fetchLoginFailure, logout } from "../reducers/loginSlice";
import { checkSessionApi, logoutApi } from "../../api"; // Импортируйте ваш API для проверки сессии

// Сага для проверки статуса авторизации
function* checkAuthStatusSaga() {
  console.log("Starting checkAuthStatusSaga");
  try {
    const response = yield call(checkSessionApi);
    console.log("checkSessionApi response:", response);
    if (response.is_authenticated) {
      yield put(fetchLoginSuccess(response.user));
    } else {
      yield put(fetchLoginFailure("Пользователь не авторизован"));
    }
  } catch (error) {
    console.error("Check auth status failed:", error);
    yield put(fetchLoginFailure(error.message));
  }
}

// Сага для выхода
function* logoutSaga() {
  console.log("Starting logoutSaga");
  try {
    const response = yield call(logoutApi);
    console.log("logoutApi response:", response);
    yield put(fetchLoginFailure("Вы вышли из системы")); 
    
  } catch (error) {
    console.error("Logout failed:", error);
    yield put(fetchLoginFailure("Ошибка при выходе"));
  }
}

export function* watchCheckAuthStatus() {
  yield takeLatest("user/checkAuthStatus", checkAuthStatusSaga); // Отслеживание действия
  yield takeLatest("user/logout", logoutSaga);
}