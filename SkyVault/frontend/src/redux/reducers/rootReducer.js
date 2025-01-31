import { combineReducers } from '@reduxjs/toolkit';
import loginSlice from './loginSlice';
import newSlice from './fileManagerSlice';
import usersSlice from './userManagementSlice';
import registerSlice from './registerSlice';

const rootReducer = combineReducers({
  login: loginSlice,
  data: newSlice,
  users: usersSlice,
  register: registerSlice
  
});

export default rootReducer;