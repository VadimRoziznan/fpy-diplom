import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [], // Список файлов
  isLoading: false,
  error: null,
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    fetchFilesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchFilesSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchFilesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteFileRequest: (state) => {
      state.isLoading = true;
    },
    deleteFileSuccess: (state, action) => {
      state.isLoading = false;
      state.data = state.data.filter((file) => file.fileId !== action.payload); // Удаляем файл из списка
    },
    deleteFileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchFilesRequest,
  fetchFilesSuccess,
  fetchFilesFailure,
  deleteFileRequest,
  deleteFileSuccess,
  deleteFileFailure,
} = filesSlice.actions;

export default filesSlice.reducer;