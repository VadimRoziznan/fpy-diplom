import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import AuthForm from '../components/AuthForm';
import { fetchLoginRequest } from '../redux/reducers/loginSlice';
import { Loding } from '../components/Loding';


export const LoginPage = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const loading = useSelector((state) => state.login.isLoading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(fetchLoginRequest(formData)); // Отправляем данные на авторизацию
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
    className="container mb-5 mt-5"
    style={{ paddingTop: '150px', paddingBottom: '50px', minHeight: '100vh' }}
  >
    {loading ? (
      // Блок загрузки
      <Loding />
    ) : (
      // Основной блок с формой
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
            />
          </div>
        </div>
      </div>
    )}
  </div>
);
};