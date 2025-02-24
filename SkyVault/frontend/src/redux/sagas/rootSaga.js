import { all } from "redux-saga/effects";
import { watchLoginSaga } from "./loginSaga";
import { watchFilesSaga } from "./fileSaga";
import { watchDeleteFileSaga } from "./deleteSaga";
import { watchUsersSaga } from "./userManagementSaga";
import { watchRegisterSaga } from "./registerSaga";
import { watchDownloadFileSaga } from "./downloadSaga";
import { watchRenameFileSaga } from "./renameFileSaga";
import { watchChangeFileCommentSaga } from "./changeFileCommentSaga";
/*import { watchUploadFile } from './handleUploadFile';*/

export default function* rootSaga() {
  console.log("Root saga initialized"); // Лог для проверки
  yield all([
    watchLoginSaga(),
    watchFilesSaga(),
    watchDeleteFileSaga(),
    watchUsersSaga(),
    watchRegisterSaga(),
    watchDownloadFileSaga(),
    watchRenameFileSaga(),
    watchChangeFileCommentSaga(),
    /*watchUploadFile(),*/
  ]);
}
