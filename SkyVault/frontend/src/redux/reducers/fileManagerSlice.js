import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [], // Список файлов
  fileLinks: [],
  isLoading: false,
  error: null,
};

/* Управление файлами */
const fileManagerSlice = createSlice({
  name: "files",
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
    deleteFileRequest: (state, action) => {
      state.isLoading = true; // ?
      state.deleteStatus = "pending";
    },
    deleteFileSuccess: (state, action) => {
      state.isLoading = false;
      state.deleteStatus = "succeeded";
      state.data = action.payload;
    },
    deleteFileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.deleteStatus = "failed";
    },
    setDeleteStatus: (state, action) => {
      state.deleteStatus = action.payload;
    },
    uploadFileRequest: (state) => {
      console.log("uploadFileRequest called");
      state.isLoading = true;
    },
    uploadFileSuccess: (state, action) => {
      state.isLoading = false;
      state.data.push(action.payload); // Сохраняем только данные ответа от сервера
    },
    uploadFileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    downloadFileRequest: (state) => {
      state.isLoading = true;
    },
    downloadFileSuccess: (state, action) => {
      state.isLoading = false;
      state.fileLinks = action.payload;
    },
    downloadFileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    renameFileRequest: (state) => {
      state.isLoading = true;
    },
    renameFileSuccess: (state) => {
      state.isLoading = false;
      state.successMessage = "Файл успешно переименован";
    },
    renameFileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetSuccessMessage: (state) => {
      state.successMessage = "";
    },
    changeFileCommentRequest: (state) => {
      state.isLoading = true;
    },
    changeFileCommentSuccess: (state) => {
      state.isLoading = false;
      state.successMessage = "Комментарий успешно изменен";
    },
    changeFileCommentFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    shareLinkRequest: (state) => {
      state.isLoading = true;
    },
    shareLinkSuccess: (state, action) => {
      state.isLoading = false;
      state.link = action.payload;
    },
    shareLinkFailure: (state, action) => {
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
  setDeleteStatus,
  uploadFileRequest,
  uploadFileSuccess,
  uploadFileFailure,
  downloadFileRequest,
  downloadFileSuccess,
  downloadFileFailure,
  renameFileRequest,
  renameFileSuccess,
  renameFileFailure,
  resetSuccessMessage,
  changeFileCommentRequest,
  changeFileCommentSuccess,
  changeFileCommentFailure,
  shareLinkRequest,
  shareLinkSuccess,
  shareLinkFailure,
} = fileManagerSlice.actions;

export default fileManagerSlice.reducer;
