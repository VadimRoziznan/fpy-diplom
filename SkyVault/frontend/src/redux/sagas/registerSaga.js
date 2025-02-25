import { call, put, takeEvery } from "redux-saga/effects";
import { fetchRegisterApi } from "../../api";
import {
  fetchRegisterRequest,
  fetchRegisterSuccess,
  fetchRegisterFailure,
} from "../reducers/registerSlice";
import Swal from "sweetalert2";

/* Saga для регистрации */
export function* fetchRegisterSaga(action) {
  try {
    const { data, status } = yield call(fetchRegisterApi, action.payload);
    if (status === 201) {
      yield Swal.fire({
        icon: "success",
        title: "Регистрация прошла успешно!",
        text: "Вы успешно зарегистрировались!",
      });
      yield put(fetchRegisterSuccess(data)); // Сохраняем данные в Redux
    } else {
      yield Swal.fire({
        icon: "error",
        title: "Ошибка",
        text: data.message || "Попробуйте повторить регистрацию!",
      });

      yield put(fetchRegisterFailure(data.message || "Ошибка регистрации"));
    }
  } catch (error) {
    yield Swal.fire({
      icon: "error",
      title: "Ошибка подключения к серверу",
      text: "Пожалуйста, попробуйте снова позже.",
    });

    yield put(fetchRegisterFailure("Ошибка подключения к серверу"));
  }
}

export function* watchRegisterSaga() {
  yield takeEvery(fetchRegisterRequest.type, fetchRegisterSaga);
}
