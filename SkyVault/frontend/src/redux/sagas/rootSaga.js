import { all } from 'redux-saga/effects';
import { watchLoginSaga } from './loginSaga';
import { watchFilesSaga } from './fileSaga';
import { watchDeleteFile } from './deleteSaga';
import { watchUsersSaga } from './userManagementSaga';
import { watchRegisterSaga } from './registerSaga';


export default function* rootSaga() {
  yield all([
    watchLoginSaga(),
    watchFilesSaga(),
    watchDeleteFile(),
    watchUsersSaga(),
    watchRegisterSaga(),
  ]);
}