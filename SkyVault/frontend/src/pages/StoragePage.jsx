import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './StoragePage.css';
import { StorageMenu } from '../components/StorageMenu';
import { StorageFiles } from '../components/StorageFiles';


export const StoragePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column flex-md-row pt-5 p-0 px-0 mt-5">
      {/* Узкая колонка слева */}
      <div className="col-12 col-md-2 border-top border-end p-3 color">
        <StorageMenu onCategoryChange={handleCategoryChange}/>
      </div>

      {/* Широкая колонка справа */}
      <div className="col-12 col-md-10 p-3 border-top">
        <StorageFiles activeCategory={activeCategory}/>
      </div>
    </div>
  );
};