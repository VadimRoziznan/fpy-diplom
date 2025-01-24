import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './StoragePage.css';
import { CategoriesMenu } from '../components/CategoriesMenu';
import { StorageFiles } from '../components/StorageFiles';


export const StoragePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="container-fluid d-flex flex-column flex-md-row pt-5 p-0 px-0 mt-5">
      {/* Узкая колонка слева */}
      <div className="col-12 col-md-2 border-top border-end p-3 color">
        <CategoriesMenu onCategoryChange={handleCategoryChange}/>
      </div>

      {/* Широкая колонка справа */}
      <div className="col-12 col-md-10 p-3 pb-0 border-top">
        <StorageFiles activeCategory={activeCategory}/>
      </div>
    </div>
  );
};