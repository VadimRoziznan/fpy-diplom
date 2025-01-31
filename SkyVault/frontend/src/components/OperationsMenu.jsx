import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { deleteFileRequest, deleteFileSuccess, deleteFileFailure } from '../redux/reducers/fileManagerSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './OperationsMenu.css';

export const OperationsMenu = ({checkedFiles, setCheckedFiles, sectionsList}) => {

  const userId = useSelector((state) => state.login.user?.id);
  const [sectionType, setSectionType] = useState('');
  const { data } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const handleClick = (actionType, Files) => {
    setSectionType(actionType);
  
    if (actionType === 'delete') {
      for (const fileId of Files) {
        try {
          //dispatch(deleteFileRequest()); // Начало удаления
          dispatch(deleteFileRequest(fileId)); // Запрос на сервер
          dispatch(deleteFileSuccess(fileId)); // Удаление из Redux
        } catch (error) {
          dispatch(deleteFileFailure(error.message)); // Логируем ошибку
          console.error(`Ошибка при удалении файла ${fileId}:`, error);
        }
      }
  
      setCheckedFiles([]); // Очистка выбранных файлов
    }
  };


  return (
      <div className="d-flex flex-wrap justify-content-start " >
        <nav className="navbar navbar-expand-lg navbar-costume">
          <div className="сontainer ">

            {/* Горизонтальное меню */}
            <div className="collapse navbar-collapse show " id="navbarMain ">
              <ul className="navbar-nav flex-row ">
                {sectionsList.map((section, index) => (
                  <li key={index} className="nav-item ">
                      <i className={`px-4 fs-4 title-icon ${section.icon}` }
                      role="button" // Указываем, что элемент работает как кнопка
                      tabIndex={0} // Делает элемент фокусируемым
                      title={section.title}
                      onClick={() => handleClick(section.type, checkedFiles)}
                      ></i>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>
  )
}
