import { combineReducers } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";
import usersSlice from "./userManagementSlice";
import registerSlice from "./registerSlice";
import fileManagerSlice from "./fileManagerSlice";

/* Объединение всех редьюсеров */
const rootReducer = combineReducers({
  login: loginSlice,
  users: usersSlice,
  register: registerSlice,
  fileManager: fileManagerSlice,
});

export default rootReducer;
