import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [], // Список файлов
  isLoading: false,
  error: null,
};

/* Получение списка пользователей и удаление */
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchUsersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteUserRequest: (state) => {
      state.isLoading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.isLoading = false;
      state.successMessage = "Пользователь успешно удален";
    },
    deleteUserFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
} = usersSlice.actions;

export default usersSlice.reducer;
