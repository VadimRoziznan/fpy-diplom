import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegisterRequest, resetUser } from '../redux/reducers/registerSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { validatePassword, validateLogin } from '../utils/utils';
import AuthForm from '../components/AuthForm';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    login: '',
    username: '',
    email: '',
    password: '',
  });

  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const userId = useSelector((state) => state.register.user?.id);
  const dispatch = useDispatch();
    const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError(
          'Пароль должен содержать минимум 8 символов, включая заглавную и строчную латинские буквы, цифру и специальный символ.'
        );
      } else {
        setPasswordError('');
      }
    }
    if (name === 'login') {
      if (!validateLogin(value)) {
        setLoginError(
          'Логин должен содержать только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов.'
        );
      } else {
        setLoginError('');
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordError || loginError) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: 'Пожалуйста, исправьте ошибки в форме перед отправкой.',
      });
      return;
    }
    console.log(formData);
    dispatch(fetchRegisterRequest(formData));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (userId) {
      console.log(userId);
      navigate(`/storage/${userId}`);
      dispatch(resetUser()); // Сброс userId
    }
  }, [userId, navigate, dispatch]);

  return (
    <div
      className="container mb-5 mt-5"
      style={{ paddingTop: '150px', paddingBottom: '50px', minHeight: '100vh' }}
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

          />
        </div>
      </div>
    </div>
  );
};