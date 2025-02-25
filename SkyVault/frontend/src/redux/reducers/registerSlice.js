import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

/* Регистрация */
const registerSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchRegisterRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRegisterSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true; // Устанавливаем авторизацию
      state.error = null;
    },
    fetchRegisterFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false; // Сбрасываем авторизацию
      state.error = action.payload;
    },
    resetUser(state) {
      state.user = null; // Сброс userId
    },
  },
});

export const {
  fetchRegisterRequest,
  fetchRegisterSuccess,
  fetchRegisterFailure,
  resetUser,
} = registerSlice.actions;

export default registerSlice.reducer;
