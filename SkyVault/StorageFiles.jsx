import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilesRequest } from '../redux/reducers/fileManagerSlice';
import { Loding } from '../components/Loding';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './storageFile.css';
import { OperationsMenu } from './OperationsMenu';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';

export const StorageFiles = ({ activeCategory }) => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.data);
  const userId = useSelector((state) => state.login.user?.id);

  console.log('data', data);

  const isInitialRender = useRef(true);

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedFiles, setCheckedFiles] = useState([]);
  const headers = [
    { name: 'Имя файла', key: 'name' },
    { name: 'Комментарий', key: 'comment' },
    { name: 'Размер', key: 'size' },
    { name: 'Дата загрузки', key: 'uploadDate' },
    { name: 'Дата последнего скачивания', key: 'downloadDate' },
  ]

  useEffect(() => {
    if (isInitialRender.current && userId) {
      dispatch(fetchFilesRequest(userId));
      isInitialRender.current = false;
    }
  }, [dispatch, userId]);

  const filteredFiles = data && Array.isArray(data)
    ? (activeCategory === 'all' ? data : data.filter(file => file.type === activeCategory))
    : [];

  const handleMainCheckboxChange = () => {
    setIsAllChecked(!isAllChecked);

    if (!isAllChecked) {
      setCheckedFiles(filteredFiles.map((file) => file.fileId));
    } else {
      setCheckedFiles([]);
    }
  };

  return (
<>
  <div className="file-list">
    {isLoading ? (
        <Loding />
    ) : (
      <div className="d-flex flex-wrap justify-content-end">
        {/* OperationsMenu */}
        <OperationsMenu checkedFiles={checkedFiles} setCheckedFiles={setCheckedFiles} />
        {/* Sticky Headers */}
        <div className="file-row d-flex w-100 p-2 file-header-sticky">
          <div className="file-column file-checkbox pb-3">
            <input
              className="form-check-input rounded"
              type="checkbox"
              checked={filteredFiles.length > 0 && filteredFiles.every(file => checkedFiles.includes(file.fileId))}
              onChange={handleMainCheckboxChange}
            />
          </div>
          <TableHeader headers={headers} />
        </div>
        <div className="w-100 border-bottom"></div>
        {filteredFiles.map((fileItem) => (
          <TableBody
            key={fileItem.fileId}
            fileItem={fileItem}
            checkedFiles={checkedFiles}
            setCheckedFiles={setCheckedFiles}
          />
        ))}
      </div>
    )}
  </div>
</>
  );
};

