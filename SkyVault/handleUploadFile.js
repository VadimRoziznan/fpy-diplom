import { call, put, takeLatest } from 'redux-saga/effects';
import { uploadFileApi } from '../../api';
import {
  uploadFileRequest,
  uploadFileSuccess,
  uploadFileFailure,
} from '../reducers/fileManagerSlice';
import { uploadFile } from '../thunks/fileThunks';
import Swal from 'sweetalert2';

// Worker saga: обрабатывает загрузку файла
function* handleUploadFile(action) {
  try {
    const { file, comment } = action.payload;

    // Создаем FormData
    const formData = new FormData();
    formData.append('file', file); // Добавляем файл
    formData.append('comment', comment); // Добавляем комментарий

    // Вызываем API
    const response = yield call(uploadFileApi, formData);

    // Диспатчим успех
    yield put(uploadFileSuccess(response));
  } catch (error) {
    // Диспатчим ошибку
    yield put(uploadFileFailure(error.message));

    // Показываем ошибку пользователю через Swal
    yield call(Swal.fire, {
      icon: 'error',
      title: 'Ошибка загрузки файла',
      text: error.message || 'Произошла неизвестная ошибка. Попробуйте снова.',
    });
  }
}

// watchUploadFile.js (Saga)
export function* watchUploadFile() {
  yield takeLatest(uploadFileRequest.type, handleUploadFile);
}