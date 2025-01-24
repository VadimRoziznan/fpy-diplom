import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const filesSlice = createSlice({
  name: 'data',
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
  },
});

export const { 
  fetchFilesRequest,
  fetchFilesSuccess,
  fetchFilesFailure,
} = filesSlice.actions;

export default filesSlice.reducer;