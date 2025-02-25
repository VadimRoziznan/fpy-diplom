import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

/* Авторизация при входе */
const loginSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchLoginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchLoginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true; // Устанавливаем авторизацию
      state.error = null;
    },
    fetchLoginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false; // Сбрасываем авторизацию
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false; // Сбрасываем авторизацию при выходе
    },
  },
});

export const {
  fetchLoginRequest,
  fetchLoginSuccess,
  fetchLoginFailure,
  logout,
} = loginSlice.actions;

export default loginSlice.reducer;
