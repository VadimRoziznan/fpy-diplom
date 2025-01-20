import { combineReducers } from '@reduxjs/toolkit';
import loginSlice from './loginSlice';

const rootReducer = combineReducers({
  login: loginSlice,
});

export default rootReducer;