// renameFileSaga.js
import { call, put, takeEvery } from "redux-saga/effects";
import { changeFileCommentApi } from "../../api";
import {
  changeFileCommentRequest,
  changeFileCommentSuccess,
  changeFileCommentFailure,
} from "../reducers/fileManagerSlice";
import Swal from "sweetalert2";

function* changeFileCommentSaga(action) {
  try {
    const { userId, fileId, newComment } = action.payload;

    if (!userId || !fileId || !newComment) {
      throw new Error(
        "Отсутствуют необходимые данные для изменения комментария",
      );
    }

    // Вызываем API для переименования файла
    const updatedFile = yield call(changeFileCommentApi, { userId, fileId, newComment });

    // Диспатчим успех с результатом
    yield put(changeFileCommentSuccess(updatedFile));
    yield Swal.fire({
      icon: "success",
      title: "Комментарий изменен!",
      text: "Комментарий был успешно изменен.",
    });
  } catch (error) {
    console.error(`Ошибка при изенении комментария: ${error.message}`);
    yield put(changeFileCommentFailure(error.message));
  }
}

// Вотчер для переименования файла
export function* watchChangeFileCommentSaga() {
  yield takeEvery(changeFileCommentRequest.type, changeFileCommentSaga);
}
