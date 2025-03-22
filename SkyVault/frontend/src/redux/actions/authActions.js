// redux/actions/authActions.js
import axios from "axios";
import { setAuthenticated, setUnauthenticated } from "../reducers/loginSlice";

export const checkAuthStatus = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/auth/session/"); // Укажите свой эндпоинт
    if (response.status === 200 && response.data.is_authenticated) {
      dispatch(setAuthenticated(response.data.user)); // Установить пользователя
    } else {
      dispatch(setUnauthenticated());
    }
  } catch (error) {
    dispatch(setUnauthenticated());
  }
};