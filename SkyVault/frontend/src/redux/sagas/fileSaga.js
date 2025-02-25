import { takeEvery, put, call } from "redux-saga/effects";
import { fetchFilesApi } from "../../api";
import {
  fetchFilesRequest,
  fetchFilesSuccess,
  fetchFilesFailure,
} from "../reducers/fileManagerSlice";
import Swal from "sweetalert2";

/* Saga для получения списка файлов */
export function* fetchFilesSaga(action) {
  try {
    const userId = action.payload;
    const data = yield call(fetchFilesApi, userId);
    yield put(fetchFilesSuccess(data)); // Сохраняем данные в Redux
  } catch (error) {
    yield put(fetchFilesFailure(error.message));
    yield call(Swal.fire, {
      icon: "error",
      title: "Ошибка подключения к серверу",
      text: "Пожалуйста, попробуйте снова позже.",
    });
  }
}

export function* watchFilesSaga() {
  yield takeEvery(fetchFilesRequest.type, fetchFilesSaga);
}
