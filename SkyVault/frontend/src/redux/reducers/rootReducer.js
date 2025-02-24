import { combineReducers } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";
import usersSlice from "./userManagementSlice";
import registerSlice from "./registerSlice";
import fileManagerSlice from "./fileManagerSlice";

const rootReducer = combineReducers({
  login: loginSlice,
  /*data: fileManagerSlice,*/
  users: usersSlice,
  register: registerSlice,
  fileManager: fileManagerSlice, // Подключаем редьюсер
});

export default rootReducer;
