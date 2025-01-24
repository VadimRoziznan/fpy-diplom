// deletelice.js
import { createSlice } from '@reduxjs/toolkit';

const fileSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    loading: false,
    error: null,
  },
  reducers: {
    deleteFileRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    deleteFileSuccess: (state, action) => {
      state.loading = false;
      state.files = state.files.filter(file => file.fileId !== action.payload);
    },
    deleteFileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFiles: (state, action) => {
      state.files = action.payload;
    },
  },
});

export const {
  deleteFileRequest,
  deleteFileSuccess,
  deleteFileFailure,
  setFiles,
} = fileSlice.actions;

export default fileSlice.reducer;