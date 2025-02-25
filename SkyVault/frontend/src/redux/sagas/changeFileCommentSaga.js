import { call, put, takeEvery } from "redux-saga/effects";
import { changeFileCommentApi } from "../../api";
import {
  changeFileCommentRequest,
  changeFileCommentSuccess,
  changeFileCommentFailure,
} from "../reducers/fileManagerSlice";
import Swal from "sweetalert2";

/* Saga для изменения комментария */
function* changeFileCommentSaga(action) {
  try {
    const { userId, fileId, newComment } = action.payload;

    if (!userId || !fileId || !newComment) {
      throw new Error(
        "Отсутствуют необходимые данные для изменения комментария",
      );
    }
    const updatedFile = yield call(changeFileCommentApi, {
      userId,
      fileId,
      newComment,
    });

    yield put(changeFileCommentSuccess(updatedFile)); // Сохраняем данные в Redux
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

export function* watchChangeFileCommentSaga() {
  yield takeEvery(changeFileCommentRequest.type, changeFileCommentSaga);
}
