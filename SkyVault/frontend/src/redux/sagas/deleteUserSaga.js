import {
  call,
  put,
  delay,
  takeEvery,
} from "redux-saga/effects";
import {
  fetchUsersRequest,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
} from "../reducers/userManagementSlice";
import { deleteUserApi } from "../../api";

/* Saga для удаления одного или нескольких пользователей */
function* deleteUserSaga(action) {
  try {
    const { userId, userIdToDelete } = action.payload;
    if (!userId || !userIdToDelete) {
      throw new Error("userId или userIdToDelete отсутствуют в payload");
    }
    yield delay(500); // Задержка 0.5 сек чтобы не было слишком много запросов
    yield call(deleteUserApi, userId, userIdToDelete);
    yield put(deleteUserSuccess(userIdToDelete)); // Сохраняем данные в Redux
    yield put(fetchUsersRequest(userId));
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    yield put(deleteUserFailure(error.message));
  }
}

export function* watchDeleteUserSaga() {
  yield takeEvery(deleteUserRequest.type, deleteUserSaga);
}