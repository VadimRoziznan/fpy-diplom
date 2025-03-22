import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isLogoutSuccess: false,
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
      state.isLoading = false; // Сбрасываем состояние загрузки
      state.isLogoutSuccess = true;
    },
    resetLogoutSuccess: (state) => {
      state.isLogoutSuccess = false;
    },
    checkAuthStatus: (state) => {
      state.isLoading = true; // Можно установить состояние загрузки
    },
  },
});

export const {
  fetchLoginRequest,
  fetchLoginSuccess,
  fetchLoginFailure,
  logout,
  resetLogoutSuccess,
  checkAuthStatus,
} = loginSlice.actions;

export default loginSlice.reducer;


