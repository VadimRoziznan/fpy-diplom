import {
  uploadFileRequest,
  uploadFileSuccess,
  uploadFileFailure,
} from "../reducers/fileManagerSlice";
import { uploadFileApi } from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../api/index";

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async ({ file, comment }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("comment", comment);

    const response = await fetch(`${BASE_URL}/upload/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Ошибка при загрузке файла");
    }

    const data = await response.json();
    return data;
  },
);
