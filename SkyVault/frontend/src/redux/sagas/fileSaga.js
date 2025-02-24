import { takeEvery, put, call } from "redux-saga/effects";
import { fetchFiles } from "../../api";
import {
  fetchFilesRequest,
  fetchFilesSuccess,
  fetchFilesFailure,
} from "../reducers/fileManagerSlice";
import Swal from "sweetalert2";

export function* fetchFilesSaga(action) {
  try {
    const userId = action.payload; // Получение userId из действия
    const data = yield call(fetchFiles, userId);
    yield put(fetchFilesSuccess(data));
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
