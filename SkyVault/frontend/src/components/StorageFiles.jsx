import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilesRequest } from '../redux/reducers/fileSlise';
import { Loding } from '../components/Loding';
import { GenerateIconWithFileName } from '../utils/utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './storageFile.css';
import { OperationsMenu } from './OperationsMenu';

export const StorageFiles = ({ activeCategory }) => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.data);
  const userId = useSelector((state) => state.login.user?.id);

  console.log('data', data);

  const isInitialRender = useRef(true);

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedFiles, setCheckedFiles] = useState([]);

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
          <div
            className="container mb-5 mt-5"
            style={{ paddingTop: '150px', paddingBottom: '50px', minHeight: '100vh' }}
          >
            <Loding />
          </div>
        ) : (
          <div className="d-flex flex-wrap justify-content-end">
            <OperationsMenu checkedFiles={checkedFiles} setCheckedFiles={setCheckedFiles}/>
            <div className="file-row d-flex w-100 p-2">
              <div className="file-column file-checkbox pb-3">
                <input
                  className="form-check-input rounded"
                  type="checkbox"
                  checked={filteredFiles.length > 0 && filteredFiles.every(file => checkedFiles.includes(file.fileId))}
                  onChange={handleMainCheckboxChange}
                />
              </div>
              <div className="file-column pb-3">
                <p>Имя файла</p>
              </div>
              <div className="file-column pb-3">
                <p>Дата создания</p>
              </div>
              <div className="file-column pb-3">
                <p>Размер</p>
              </div>
            </div>
            <div className="w-100 border-bottom"></div>
            {filteredFiles.map((fileItem) => (
              <FileRow
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

const FileRow = ({ fileItem, checkedFiles, setCheckedFiles }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isChecked = checkedFiles.includes(fileItem.fileId);

  const handleCheckboxChange = () => {
    if (isChecked) {
      setCheckedFiles(checkedFiles.filter((fileId) => fileId !== fileItem.fileId));
    } else {
      setCheckedFiles([...checkedFiles, fileItem.fileId]);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <>
      <div
        className={`file-row d-flex w-100 p-2 ${isHovered || isChecked ? 'hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="file-column file-checkbox pb-3">
          {(isHovered || isChecked) && (
            <input
              className="form-check-input rounded"
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          )}
        </div>
        <div className="file-column pb-3">
          <GenerateIconWithFileName fileName={fileItem.name} link={fileItem.link} />
        </div>
        <div className="file-column pb-3">
          {new Date(Date.now()).toLocaleDateString()}
        </div>
        <div className="file-column pb-3">
          {fileItem.size} KB
        </div>
      </div>
      <div className="w-100 border-bottom"></div>
    </>
  );
};