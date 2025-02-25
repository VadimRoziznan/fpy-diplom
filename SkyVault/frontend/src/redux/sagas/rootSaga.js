import { all } from "redux-saga/effects";
import { watchLoginSaga } from "./loginSaga";
import { watchFilesSaga } from "./fileSaga";
import { watchDeleteFileSaga } from "./deleteFileSaga";
import { watchUsersSaga } from "./userManagementSaga";
import { watchRegisterSaga } from "./registerSaga";
import { watchDownloadFileSaga } from "./downloadSaga";
import { watchRenameFileSaga } from "./renameFileSaga";
import { watchChangeFileCommentSaga } from "./changeFileCommentSaga";
import { watchShareLinkSaga } from "./shareLinkSaga";
import { watchDeleteUserSaga } from "./deleteUserSaga";

/* Корневой сага */
export default function* rootSaga() {
  yield all([
    watchLoginSaga(),
    watchFilesSaga(),
    watchDeleteFileSaga(),
    watchUsersSaga(),
    watchRegisterSaga(),
    watchDownloadFileSaga(),
    watchRenameFileSaga(),
    watchChangeFileCommentSaga(),
    watchShareLinkSaga(),
    watchDeleteUserSaga(),
  ]);
}
