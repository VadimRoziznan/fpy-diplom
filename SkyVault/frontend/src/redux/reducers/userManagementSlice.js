import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [], // Список файлов
  isLoading: false,
  error: null,
};

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
    deleteUsersRequest: (state) => {
      state.isLoading = true;
    },
    deleteUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.data = state.data.filter((file) => file.fileId !== action.payload); // Удаляем файл из списка
    },
    deleteUsersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  deleteUsersRequest,
  deleteUsersSuccess,
  deleteUsersFailure,
} = usersSlice.actions;

export default usersSlice.reducer;
