import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisterRequest } from "../redux/reducers/registerSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { validatePassword, validateLogin } from "../utils/utils";
import AuthForm from "../components/AuthForm";

/* Страница регистрации */
export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const userId = useSelector((state) => state.register.user?.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* Обработчик изменения полей формы */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      if (!validatePassword(value)) {
        setPasswordError(
          "Пароль должен содержать минимум 8 символов, включая заглавную и строчную латинские буквы, цифру и специальный символ.",
        );
      } else {
        setPasswordError("");
      }
    }
    if (name === "username") {
      if (!validateLogin(value)) {
        setLoginError(
          "Логин должен содержать только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов.",
        );
      } else {
        setLoginError("");
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /* Обработчик отправки формы */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError || loginError) {
      Swal.fire({
        icon: "error",
        title: "Ошибка",
        text: "Пожалуйста, исправьте ошибки в форме перед отправкой.",
      });
      return;
    }
    dispatch(fetchRegisterRequest(formData));
  };

  /* Обработчик переключения видимости пароля */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /* Проверяем, авторизован ли пользователь */
  useEffect(() => {
    if (userId) {
      navigate("/login");
    }
  }, [userId, navigate, dispatch]);

  return (
    <div
      className="container mb-5 mt-5"
      style={{ paddingTop: "150px", paddingBottom: "50px", minHeight: "100vh" }}
    >
      <h1 className="text-center">Регистрация</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <AuthForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            passwordError={passwordError}
            loginError={loginError}
            togglePasswordVisibility={togglePasswordVisibility}
            showPassword={showPassword}
            isLogin={false} // Указываем, что это форма регистрации
          />
        </div>
      </div>
    </div>
  );
};
