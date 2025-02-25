import React from "react";
import { useParams } from "react-router-dom";
import { StoragePage } from "./StoragePage";

/* Компонент страницы пользовательских файлов */
export const UserFilesPage = () => {
  const { id: userId } = useParams();
  return <StoragePage userId={userId} />;
};
