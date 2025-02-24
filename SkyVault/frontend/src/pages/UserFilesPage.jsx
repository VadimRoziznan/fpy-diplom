import React from "react";
import { useParams } from "react-router-dom";
import { StoragePage } from "./StoragePage";

export const UserFilesPage = () => {
  const { id: userId } = useParams();
  return <StoragePage userId={userId} />;
};
