import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CategoriesMenu } from "../components/CategoriesMenu";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilesRequest } from "../redux/reducers/fileManagerSlice";
import { Loading } from "../components/Loading";
import { OperationsMenu } from "../components/OperationsMenu";
import { sectionsList } from "../constants/menuLists";
import { DynamicTable } from "../components/DynamicTable";
import { fetchUsersRequest } from "../redux/reducers/userManagementSlice";
import { usersHeaders, adminMenuList } from "../constants/menuLists";
import { changeUserStatusAdmin } from "../api";
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
  const [checkedUser, setCheckedUser] = useState([]);
  const [hoveredUserId, setHoveredUserId] = useState(null); // New state for tracking hovered user
  const location = useLocation();

  // Синхронизация состояния users с usersData
  useEffect(() => {
    setUsers(usersData || []); // Если usersData пустой, устанавливаем пустой массив
  }, [usersData]);

  useEffect(() => {
    dispatch(fetchUsersRequest(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) {
      console.log("useEffect fdd");
      dispatch(fetchFilesRequest(userId));
    }
  }, [dispatch, userId, location.pathname]);

  const handleRefreshData = () => {
    console.log("handleRefreshData userId", userId);
    if (userId) {
      console.log("handleRefreshData sdgsg");
      dispatch(fetchFilesRequest(userId));
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleViewUser = (userId) => {
    navigate(`/user-files/${userId}`);
  };

  const toggleUserAdmin = async (userId) => {
    const userToUpdate = users.find((user) => user.id === userId);

    try {
      // Отправляем запрос на сервер для изменения статуса
      const response = await changeUserStatusAdmin(
        userId,
        !userToUpdate.is_staff,
      );
      console.log("Response:", response);
      if (response.ok) {
        // Если запрос успешен, обновляем локальное состояние
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, is_staff: !user.is_staff } : user,
          ),
        );
      } else {
        console.error("Не удалось изменить статус пользователя");
      }
    } catch (error) {
      console.error("Ошибка при изменении статуса пользователя:", error);
    }
  };

  return (
    <>
      <div className="container-fluid d-flex flex-column flex-md-row pt-5 p-0 px-0 mt-5">
        <div className="col-12 col-md-2 border-top border-end p-3 color">
          <CategoriesMenu
            onCategoryChange={handleCategoryChange}
            menuList={adminMenuList}
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
                  userId={userId}
                  checkedFiles={checkedUser}
                  setCheckedFiles={setCheckedUser}
                  sectionsList={sectionsList}
                  onRefreshData={handleRefreshData} // Передаём callback для обновления данных
                />
              </div>

              <DynamicTable
                data={users}
                headers={usersHeaders}
                checkedFiles={checkedUser}
                setCheckedFiles={setCheckedUser}
                checkbox={true}
                onRowСlick={(userId) => handleViewUser(userId)}
                renderRowActions={(user) => (
                  <i
                    className={`bi ${
                      user.is_staff
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
                /*rowKey="id"*/
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
