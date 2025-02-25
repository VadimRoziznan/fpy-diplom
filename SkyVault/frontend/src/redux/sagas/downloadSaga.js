import { takeEvery, put, call, delay } from "redux-saga/effects";
import {
  downloadFileRequest,
  downloadFileSuccess,
  downloadFileFailure,
} from "../reducers/fileManagerSlice";
import Swal from "sweetalert2";
import { downloadFileApi } from "../../api";

/* Saga для скачивания файлов */
export function* downloadFileSaga(action) {
  try {
    const fileIds = action.payload;
    const filesLinkArray = yield call(downloadFileApi, fileIds);

    if (!filesLinkArray || filesLinkArray.length === 0) {
      throw new Error("Сервер не вернул ссылки для загрузки");
    }

    yield put(downloadFileSuccess(filesLinkArray)); // Сохраняем ссылки в Redux

    // Запускаем скачивание файлов по очереди
    for (const file of filesLinkArray) {
      yield call(downloadFileInBrowser, file.file_link, file.file_name);
      yield delay(500); // Задержка 0.5 сек между скачиваниями
    }
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    yield put(downloadFileFailure(error.message));

    yield call(Swal.fire, {
      icon: "error",
      title: "Ошибка загрузки файла",
      text: "Пожалуйста, попробуйте снова позже.",
    });
  }
}

/* Запускает скачивание файла в новом окне (чтобы избежать блокировки браузером) */
async function downloadFileInBrowser(fileUrl, fileName) {
  try {
    const response = await fetch(fileUrl, { mode: "cors" }); // Загружаем файл
    if (!response.ok)
      throw new Error(`Ошибка загрузки файла: ${response.statusText}`);

    const blob = await response.blob(); // Преобразуем в Blob для скачивания
    const blobUrl = window.URL.createObjectURL(blob); // Создаем URL для Blob

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName || "downloaded_file";
    document.body.appendChild(link);
    link.click(); // Запускаем скачивание
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl); // Очищаем память
  } catch (error) {
    console.error(`Ошибка скачивания файла: ${error.message}`);
  }
}

export function* watchDownloadFileSaga() {
  yield takeEvery(downloadFileRequest.type, downloadFileSaga);
}
