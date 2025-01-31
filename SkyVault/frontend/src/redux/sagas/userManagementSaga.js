import { takeEvery, put, call } from 'redux-saga/effects';
import { fetchUsers } from '../../api';
import { 
  fetchUsersRequest, 
  fetchUsersSuccess, 
  fetchUsersFailure 
} from '../reducers/userManagementSlice';
import Swal from 'sweetalert2';

export function* fetchUsersSaga(action) {
  try {
    const userId = action.payload; // Получение userId из действия
    const data = yield call(fetchUsers, userId);
    yield put(fetchUsersSuccess(data));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
    yield call(Swal.fire, {
      icon: 'error',
      title: 'Ошибка подключения к серверу',
      text: 'Пожалуйста, попробуйте снова позже.',
    });
  }
}

export function* watchUsersSaga() {
  yield takeEvery(fetchUsersRequest.type, fetchUsersSaga);
}
