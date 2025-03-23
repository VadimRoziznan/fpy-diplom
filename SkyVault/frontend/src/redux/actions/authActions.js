import axios from "axios";
import { setAuthenticated, setUnauthenticated } from "../reducers/loginSlice";

export const checkAuthStatus = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/auth/session/");
    if (response.status === 200 && response.data.is_authenticated) {
      dispatch(setAuthenticated(response.data.user));
    } else {
      dispatch(setUnauthenticated());
    }
  } catch (error) {
    dispatch(setUnauthenticated());
  }
};