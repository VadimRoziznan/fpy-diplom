import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoriesMenu } from "../components/CategoriesMenu";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilesRequest } from "../redux/reducers/fileManagerSlice";
import { Loading } from "../components/Loading";
import { OperationsMenu } from "../components/OperationsMenu";
import { sectionsList } from "../constants/menuLists";
import { DynamicTable } from "../components/DynamicTable";
import { fetchUsersRequest } from "../redux/reducers/userManagementSlice";
import { headers, menuList } from "../constants/menuLists";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StoragePage.css";
import "../components/storageFile.css";

export const DashboardPage = () => {
  const [activeCategory, setActiveCategory] = useState("users");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.login.user?.id);
  const usersData = useSelector((state) => state.users.data); // Данные из Redux
  const [users, setUsers] = useState([]); // Локальное состояние для пользователей

  const isLoading = useSelector((state) => state.users.isLoading);
  const isInitialRender = useRef(true);
  const [checkedUser, setCheckedUser] = useState([]);
  const [hoveredUserId, setHoveredUserId] = useState(null); // New state for tracking hovered user

  // Синхронизация состояния users с usersData
  useEffect(() => {
    setUsers(usersData || []); // Если usersData пустой, устанавливаем пустой массив
  }, [usersData]);

  useEffect(() => {
    if (isInitialRender.current && userId) {
      dispatch(fetchUsersRequest(userId));
      isInitialRender.current = false;
    }
  }, [dispatch, userId]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleViewUser = (userId) => {
    navigate(`/storage/${userId}`)
  };

  const toggleUserAdmin = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
      )
    );
  };

  return (
    <>
      <div className="container-fluid d-flex flex-column flex-md-row pt-5 p-0 px-0 mt-5">
        <div className="col-12 col-md-2 border-top border-end p-3 color">
          <CategoriesMenu
            onCategoryChange={handleCategoryChange}
            menuList={menuList}
            defaultCategory={"users"}
          />
        </div>
        <div className="col-12 col-md-10 p-3 pb-0 border-top">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="d-flex flex-wrap justify-content-end file-header-sticky">
                <OperationsMenu
                  checkedFiles={checkedUser}
                  setCheckedFiles={setCheckedUser}
                  sectionsList={sectionsList}
                />
              </div>

              <DynamicTable
                data={users}
                headers={headers}
                checkedFiles={checkedUser}
                setCheckedFiles={setCheckedUser}
                checkbox={true}
                onRowСlick={(userId) => handleViewUser(userId)}
                renderRowActions={(user) => (
                  <i
                    className={`bi ${
                      user.isAdmin
                        ? "bi-check-circle-fill text-success"
                        : "bi-x-circle-fill text-danger"
                    }`}
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    onClick={(event) => {
                      event.stopPropagation(); // Останавливаем распространение события
                      toggleUserAdmin(user.id);
                    }}
                  ></i>
                )}
                onRowHover={(user) => setHoveredUserId(user.id)}
                rowKey="id"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};