import { takeEvery, put, call } from "redux-saga/effects";
import { fetchUsersApi } from "../../api";
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
} from "../reducers/userManagementSlice";
import Swal from "sweetalert2";

/* Saga для получения списка пользователей */
export function* fetchUsersSaga(action) {
  try {
    const userId = action.payload;
    const data = yield call(fetchUsersApi, userId);
    yield put(fetchUsersSuccess(data)); // Сохраняем данные в Redux
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
    yield call(Swal.fire, {
      icon: "error",
      title: "Ошибка подключения к серверу",
      text: "Пожалуйста, попробуйте снова позже.",
    });
  }
}

export function* watchUsersSaga() {
  yield takeEvery(fetchUsersRequest.type, fetchUsersSaga);
}
