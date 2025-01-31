import React, { useEffect, useRef, useState } from 'react';
import { CategoriesMenu } from '../components/CategoriesMenu';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilesRequest } from '../redux/reducers/fileManagerSlice';
import { Loading } from '../components/Loading';
import { OperationsMenu } from '../components/OperationsMenu';
import { sectionsList } from '../constants/menuLists';
import { DynamicTable } from '../components/DynamicTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './StoragePage.css';
import '../components/storageFile.css';

export const StoragePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [checkedFiles, setCheckedFiles] = useState([]);
  const { data, isLoading } = useSelector((state) => state.data);
  const userId = useSelector((state) => state.login.user?.id);
  const dispatch = useDispatch();
  const isInitialRender = useRef(true);


  const menuList = [
    { title: 'Все файлы', type: 'all', icon: 'bi bi-list' },
    { title: 'Фото', type: 'photos', icon: 'bi bi-images' },
    { title: 'Документы', type: 'documents', icon: 'bi bi-file-earmark-text' },
    { title: 'Видео', type: 'videos', icon: 'bi bi-film' },
    { title: 'Музыка', type: 'music', icon: 'bi bi-music-note-beamed' },
  ];
  const headers = [
    { name: 'Имя файла', key: 'name' },
    { name: 'Комментарий', key: 'comment' },
    { name: 'Размер', key: 'size' },
    { name: 'Дата загрузки', key: 'uploadDate' },
    { name: 'Дата последнего скачивания', key: 'lastDownloadDate' },
  ];

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  useEffect(() => {
    if (isInitialRender.current && userId) {
      dispatch(fetchFilesRequest(userId));
      isInitialRender.current = false;
    }
  }, [dispatch, userId]);

  const filteredFiles = data && Array.isArray(data)
    ? (activeCategory === 'all' ? data : data.filter((file) => file.type === activeCategory))
    : [];

  return (
    <div className="container-fluid d-flex flex-column flex-md-row pt-5 p-0 px-0 mt-5">
      {/* Узкая колонка слева */}
      <div className="col-12 col-md-2 border-top border-end p-3 color">
        <CategoriesMenu onCategoryChange={handleCategoryChange} menuList={menuList} defaultCategory={activeCategory} />
      </div>
      {/* Широкая колонка справа */}
      <div className="col-12 col-md-10 p-3 pb-0 border-top">
        {isLoading ? (
          <Loading />
        ) : (
          <>
          <div className="d-flex flex-wrap justify-content-end file-header-sticky">
            <OperationsMenu checkedFiles={checkedFiles} setCheckedFiles={setCheckedFiles} sectionsList={sectionsList} />
          </div>
          <DynamicTable
            data={filteredFiles}
            headers={headers}
            checkedFiles={checkedFiles}
            setCheckedFiles={setCheckedFiles}
            checkbox={true} // Чекбоксы включены
            rowKey="fileId" // Уникальный ключ для файлов
          />
          </>
        )}
      </div>
    </div>
  );
};