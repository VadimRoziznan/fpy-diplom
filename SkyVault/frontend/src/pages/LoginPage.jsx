import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { fetchLoginRequest } from "../redux/reducers/loginSlice";
import { Loading } from "../components/Loading";

/* Страница авторизации */
export const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const loading = useSelector((state) => state.login.isLoading);
  const userId = useSelector((state) => state.login.user?.id);

  /* Обработчик изменения полей формы */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /* Обработчик отправки формы */
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(fetchLoginRequest(formData));
  };

  /* Перенаправление на страницу хранилища после успешной авторизации */
  useEffect(() => {
    if (userId) {
      navigate(`/storage/${userId}`);
    }
  }, [userId, navigate]);

  /* Переключение видимости пароля */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="container mb-5 mt-5"
      style={{ paddingTop: "150px", paddingBottom: "50px", minHeight: "100vh" }}
    >
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h1 className="text-center">Вход</h1>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <AuthForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                togglePasswordVisibility={togglePasswordVisibility}
                showPassword={showPassword}
                isLogin={true} // Указываем, что это форма входа
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
