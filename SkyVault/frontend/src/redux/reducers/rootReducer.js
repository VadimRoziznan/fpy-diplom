import { combineReducers } from '@reduxjs/toolkit';
import loginSlice from './loginSlice';
import filesSlice from './fileSlise';
import deleteSlice from './deleteSlice';

const rootReducer = combineReducers({
  login: loginSlice,
  data: filesSlice,
  delete: deleteSlice
});

export default rootReducer;