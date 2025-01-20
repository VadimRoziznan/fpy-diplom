import { all } from 'redux-saga/effects';
import { watchLoginSaga } from './loginSaga';


export default function* rootSaga() {
  yield all([
    watchLoginSaga(),
  ]);
}