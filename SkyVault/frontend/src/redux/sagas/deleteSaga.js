// deleteSagas.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { deleteFileRequest, deleteFileSuccess, deleteFileFailure } from '../reducers/deleteSlice';
import { fetchDeleteFile } from '../../api';

function* deleteFileSaga(action) {
  try {
    yield call(fetchDeleteFile, action.payload); // action.payload should be the fileId
    yield put(deleteFileSuccess(action.payload));
  } catch (error) {
    yield put(deleteFileFailure(error.message));
  }
}

export function* watchDeleteFile() {
  yield takeLatest(deleteFileRequest.type, deleteFileSaga);
}