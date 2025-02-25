import { takeEvery, put, call } from "redux-saga/effects";
import {
  shareLinkRequest,
  shareLinkSuccess,
  shareLinkFailure,
} from "../reducers/fileManagerSlice";
import Swal from "sweetalert2";
import { fetchShareLinkApi } from "../../api";

/* Saga для получения ссылки на скачивание файла */
export function* shareLinkSaga(action) {
  try {
    const fileId = action.payload;
    const link = yield call(fetchShareLinkApi, { fileId });

    if (!link) {
      throw new Error("Сервер не вернул ссылку для загрузки");
    }

    yield put(shareLinkSuccess(link)); // Сохраняем ссылку в Redux

    // Копируем ссылку в буфер обмена
    yield call(copyToClipboard, link);
  } catch (error) {
    console.error("Ошибка получения ссылки:", error);
    yield put(shareLinkFailure(error.message));

    yield call(Swal.fire, {
      icon: "error",
      title: "Ошибка получения ссылки",
      text: "Пожалуйста, попробуйте снова позже.",
    });
  }
}

/* Функция для копирования ссылки в буфер обмена */
async function copyToClipboard(text) {
  try {
    const link = JSON.parse(text).link;
    await navigator.clipboard.writeText(link);
    Swal.fire({
      icon: "success",
      title: "Ссылка скопирована в буфер обмена",
      text: "Теперь вы можете поделиться ей с другими.",
    });
  } catch (error) {
    console.error("Ошибка копирования в буфер обмена:", error);
  }
}

export function* watchShareLinkSaga() {
  yield takeEvery(shareLinkRequest.type, shareLinkSaga);
}