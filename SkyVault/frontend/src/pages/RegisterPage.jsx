import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Swal from 'sweetalert2';
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

    try {
      const response = await fetch('http://your-api-url/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Регистрация прошла успешно!',
          text: 'Вы успешно зарегистрировались!',
        });
        setFormData({ login: '', username: '', email: '', password: '' });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Ошибка',
          text: errorData.message || 'Что-то пошло не так',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка подключения к серверу',
        text: 'Пожалуйста, попробуйте снова позже.',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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