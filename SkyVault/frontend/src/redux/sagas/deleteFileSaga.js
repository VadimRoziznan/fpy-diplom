import {
  call,
  put,
  delay,
  takeEvery,
} from "redux-saga/effects";
import {
  fetchFilesRequest,
  deleteFileRequest,
  deleteFileSuccess,
  deleteFileFailure,
  setDeleteStatus,
} from "../reducers/fileManagerSlice";
import { deleteFileApi } from "../../api";

/* Saga для удаления одного или нескольких файлов */
function* deleteFileSaga(action) {
  try {
    const { userId, fileIdToDelete } = action.payload;
    if (!userId || !fileIdToDelete) {
      throw new Error("userId или fileId отсутствуют в payload");
    }

    yield put(setDeleteStatus("pending")); // Сохраняем данные в Redux
    yield delay(500); // Задержка 0.5 сек чтобы не было слишком много запросов
    yield call(deleteFileApi, userId, fileIdToDelete);
    yield put(deleteFileSuccess(fileIdToDelete)); // Сохраняем данные в Redux
    yield put(setDeleteStatus("succeeded")); // Сохраняем данные в Redux
    yield put(fetchFilesRequest(userId)); // Обновляем список файлов в Redux
  } catch (error) {
    console.error(`Error deleting files: ${error.message}`);
    yield put(deleteFileFailure(error.message));
  }
}

export function* watchDeleteFileSaga() {
  yield takeEvery(deleteFileRequest.type, deleteFileSaga);
}
