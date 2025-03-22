import { combineReducers } from "redux";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  login: authReducer, // Состояние аутентификации будет доступно как state.login
});

export default rootReducer;