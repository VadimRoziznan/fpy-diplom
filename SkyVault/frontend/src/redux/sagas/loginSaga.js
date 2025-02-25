import { call, put, takeEvery } from "redux-saga/effects";
import { fetchLoginApi } from "../../api";
import {
  fetchLoginRequest,
  fetchLoginSuccess,
  fetchLoginFailure,
} from "../reducers/loginSlice";
import Swal from "sweetalert2";

/* Saga для входа в систему */
export function* fetchLoginSaga(action) {
  try {
    const { data, status } = yield call(fetchLoginApi, action.payload);
    if (status === 200) {
      yield Swal.fire({
        icon: "success",
        title: "Успешный вход!",
        text: "Вы успешно вошли в систему!",
      });
      yield put(fetchLoginSuccess(data)); // Сохраняем данные в Redux
    } else {
      yield Swal.fire({
        icon: "error",
        title: "Ошибка",
        text: data.message || "Неверный логин или пароль!",
      });

      yield put(fetchLoginFailure(data.message || "Ошибка входа"));
    }
  } catch (error) {
    yield Swal.fire({
      icon: "error",
      title: "Ошибка подключения к серверу",
      text: "Пожалуйста, попробуйте снова позже.",
    });

    yield put(fetchLoginFailure("Ошибка подключения к серверу"));
  }
}

export function* watchLoginSaga() {
  yield takeEvery(fetchLoginRequest.type, fetchLoginSaga);
}
