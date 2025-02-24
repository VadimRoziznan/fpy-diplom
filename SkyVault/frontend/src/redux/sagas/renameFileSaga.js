// renameFileSaga.js
import { call, put, takeEvery } from "redux-saga/effects";
import { renameFileApi } from "../../api";
import {
  renameFileRequest,
  renameFileSuccess,
  renameFileFailure,
} from "../reducers/fileManagerSlice";
import Swal from "sweetalert2";

function* renameFileSaga(action) {
  try {
    const { userId, fileId, newName } = action.payload;

    if (!userId || !fileId || !newName) {
      throw new Error(
        "Отсутствуют необходимые данные для переименования файла",
      );
    }

    // Вызываем API для переименования файла
    const updatedFile = yield call(renameFileApi, { userId, fileId, newName });

    // Диспатчим успех с результатом
    yield put(renameFileSuccess(updatedFile));
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

// Вотчер для переименования файла
export function* watchRenameFileSaga() {
  yield takeEvery(renameFileRequest.type, renameFileSaga);
}
