// deleteSagas.js
import {
  call,
  put,
  takeLatest,
  delay,
  all,
  takeEvery,
} from "redux-saga/effects";
import {
  fetchFilesRequest,
  deleteFileRequest,
  deleteFileSuccess,
  deleteFileFailure,
  setDeleteStatus,
} from "../reducers/fileManagerSlice";
import { fetchDeleteFile } from "../../api";

/**
 * Сага для удаления одного или нескольких файлов
 */
function* deleteFileSaga(action) {
  try {
    const { userId, fileId } = action.payload;

    if (!userId || !fileId) {
      throw new Error("userId или fileId отсутствуют в payload");
    }

    yield put(setDeleteStatus("pending"));
    yield delay(500);
    yield call(fetchDeleteFile, userId, fileId);
    yield put(deleteFileSuccess(fileId));
    yield put(setDeleteStatus("succeeded"));
    yield put(fetchFilesRequest(userId));
  } catch (error) {
    console.error(`Error deleting files: ${error.message}`);
    yield put(deleteFileFailure(error.message));
  }
}

/**
 * Вотчер для удаления файлов
 */

export function* watchDeleteFileSaga() {
  yield takeEvery(deleteFileRequest.type, deleteFileSaga);
}
