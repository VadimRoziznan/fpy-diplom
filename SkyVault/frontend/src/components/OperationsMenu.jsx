import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { deleteFileRequest, deleteFileSuccess } from '../redux/reducers/deleteSlice';
import { fetchFilesRequest } from '../redux/reducers/fileSlise';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './OperationsMenu.css';

export const OperationsMenu = ({checkedFiles, setCheckedFiles}) => {

  const userId = useSelector((state) => state.login.user?.id);
  const [sectionType, setSectionType] = useState('');
  const { data } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const sectionsList = [

    { title: 'Скачать', type: 'download', icon: 'bi bi-download' },
    { title: 'Переименовать', type: 'rename', icon: 'bi bi-pencil-square' },
    { title: 'Удалить', type: 'delete', icon: 'bi bi-trash' },
    /*{ title: 'Копировать', type: 'copy', icon: 'bi bi-files' },
    { title: 'Переместить', type: 'move', icon: 'bi bi-file-earmark-arrow-up' },*/
    { title: 'Поделиться', type: 'share', icon: 'bi bi-share' },

  ];

  const handleClick = (actionType) => {
    setSectionType(actionType);
  
    if (actionType === 'delete') {
      for (const fileId of checkedFiles) {
        try {
          // Удаляем файл на сервере
          dispatch(deleteFileRequest(fileId));
          // Локально обновляем Redux, чтобы не ждать обновления с сервера
          dispatch(deleteFileSuccess(fileId));
        } catch (error) {
          console.error(`Ошибка при удалении файла ${fileId}:`, error);
        }
      }

      // Очищаем список выбранных файлов
      setCheckedFiles([]);
  
      // Если хотите, можете обновить данные с сервера
      if (userId) {
        dispatch(fetchFilesRequest(userId));
      }
    }
  };



  return (
    <div className="d-flex flex-wrap justify-content-start">
      <nav className="navbar navbar-expand-lg navbar-costume">
        <div className="сontainer">

          {/* Горизонтальное меню */}
          <div className="collapse navbar-collapse show" id="navbarMain">
            <ul className="navbar-nav flex-row">
              {sectionsList.map((section, index) => (
                <li key={index} className="nav-item">
                    <i className={`px-4 fs-4 title-icon ${section.icon}` }
                    role="button" // Указываем, что элемент работает как кнопка
                    tabIndex={0} // Делает элемент фокусируемым
                    title={section.title}
                    onClick={() => handleClick(section.type)}
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
