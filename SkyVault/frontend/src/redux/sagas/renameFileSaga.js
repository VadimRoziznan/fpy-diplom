import { call, put, takeEvery } from "redux-saga/effects";
import { renameFileApi } from "../../api";
import {
  renameFileRequest,
  renameFileSuccess,
  renameFileFailure,
} from "../reducers/fileManagerSlice";
import Swal from "sweetalert2";

/* Saga для переименования файлов */
function* renameFileSaga(action) {
  try {
    const { userId, fileId, newName } = action.payload;

    if (!userId || !fileId || !newName) {
      throw new Error(
        "Отсутствуют необходимые данные для переименования файла",
      );
    }
    const updatedFile = yield call(renameFileApi, { userId, fileId, newName });

    yield put(renameFileSuccess(updatedFile)); // Сохраняем данные в Redux
    yield Swal.fire({
      icon: "success",
      title: "Файл переименован!",
      text: "Файл был успешно переименован.",
    });
  } catch (error) {
    console.error(`Ошибка при переименовании файла: ${error.message}`);
    yield put(renameFileFailure(error.message));
  }
}

export function* watchRenameFileSaga() {
  yield takeEvery(renameFileRequest.type, renameFileSaga);
}
