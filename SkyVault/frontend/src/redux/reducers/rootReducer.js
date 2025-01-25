import { combineReducers } from '@reduxjs/toolkit';
import loginSlice from './loginSlice';

import newSlice from './fileManagerSlice';

const rootReducer = combineReducers({
  login: loginSlice,
  data: newSlice,
  
});

export default rootReducer;