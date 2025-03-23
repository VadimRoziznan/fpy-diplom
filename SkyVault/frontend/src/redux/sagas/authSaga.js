import { call, put, takeLatest } from "redux-saga/effects";
import { fetchLoginSuccess, fetchLoginFailure} from "../reducers/loginSlice";
import { checkSessionApi, logoutApi } from "../../api";

// Сага для проверки статуса авторизации
function* checkAuthStatusSaga() {
  try {
    const response = yield call(checkSessionApi);
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
  try {
    const response = yield call(logoutApi);
    yield put(fetchLoginFailure("Вы вышли из системы")); 
  } catch (error) {
    console.error("Logout failed:", error);
    yield put(fetchLoginFailure("Ошибка при выходе"));
  }
}

export function* watchCheckAuthStatus() {
  yield takeLatest("user/checkAuthStatus", checkAuthStatusSaga);
  yield takeLatest("user/logout", logoutSaga);
}