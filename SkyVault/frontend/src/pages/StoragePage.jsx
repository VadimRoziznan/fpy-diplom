import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { CategoriesMenu } from "../components/CategoriesMenu";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilesRequest } from "../redux/reducers/fileManagerSlice";
import { Loading } from "../components/Loading";
import { OperationsMenu } from "../components/OperationsMenu";
import { sectionsList } from "../constants/menuLists";
import { DynamicTable } from "../components/DynamicTable";
import { storageMenuList, filesHeaders } from "../constants/menuLists";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./StoragePage.css";
import "../components/storageFile.css";

export const StoragePage = ({ userId: propUserId }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [checkedFiles, setCheckedFiles] = useState([]);
  const { data, isLoading } = useSelector((state) => state.fileManager);
  const reduxUserId = useSelector((state) => state.login.user?.id); // Если `userId` не передан через пропсы, берем его из Redux
  const userId = propUserId || reduxUserId;

  const dispatch = useDispatch();
  const location = useLocation();

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleRefreshData = () => {
    if (userId) {
      dispatch(fetchFilesRequest(userId));
    }
    console.log("data", data);  
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchFilesRequest(userId));
    }
  }, [dispatch, userId, location.pathname]);

  useEffect(() => {}, [isLoading, data]);

  const filteredFiles =
    data && Array.isArray(data)
      ? activeCategory === "all"
        ? data
        : data.filter((file) => file.type === activeCategory)
      : [];

  return (
    <div className="container-fluid d-flex flex-column flex-md-row pt-5 p-0 px-0 mt-5">
      {/* Узкая колонка слева */}
      <div className="col-12 col-md-2 border-top border-end p-3 color">
        <CategoriesMenu
          onCategoryChange={handleCategoryChange}
          menuList={storageMenuList}
          defaultCategory={activeCategory}
        />
      </div>
      {/* Широкая колонка справа */}
      <div className="col-12 col-md-10 p-3 pb-0 border-top">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="d-flex flex-wrap justify-content-end file-header-sticky">
              <OperationsMenu
                userId={userId}
                checkedFiles={checkedFiles}
                setCheckedFiles={setCheckedFiles}
                sectionsList={sectionsList}
                onRefreshData={handleRefreshData} // Передаём callback для обновления данных
              />
            </div>
            <DynamicTable
              data={filteredFiles}
              headers={filesHeaders}
              checkedFiles={checkedFiles}
              setCheckedFiles={setCheckedFiles}
              checkbox={true} // Чекбоксы включены
              /*rowKey="fileId" // Уникальный ключ для файлов*/
            />
          </>
        )}
      </div>
    </div>
  );
};
