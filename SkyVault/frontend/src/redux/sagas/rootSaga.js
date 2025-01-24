import { all } from 'redux-saga/effects';
import { watchLoginSaga } from './loginSaga';
import { watchFilesSaga } from './fileSaga';
import { watchDeleteFile } from './deleteSaga';


export default function* rootSaga() {
  yield all([
    watchLoginSaga(),
    watchFilesSaga(),
    watchDeleteFile(),
  ]);
}