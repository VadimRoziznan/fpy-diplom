import React, { useState } from "react";
import { GenerateIconWithFileName } from "../utils/utils";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./DynamicTable.css";

export const DynamicTable = ({
  data = [], // данные для таблицы
  headers = [], // заголовки столбцов
  checkedFiles = [], // выбранные элементы
  setCheckedFiles = () => {}, // функция изменения выбранных элементов
  checkbox = true, // показывать чекбоксы или нет
  onRowСlick = () => {}, // обработчик клика по строке
  renderRowActions = null, // функция для рендера дополнительных действий в строке
  onRowHover = null, // обработчик ховера строки
  rowKey = "id", // уникальный ключ строки
}) => {

  const [hoveredRow, setHoveredRow] = useState(null);

  // Обработчик изменения состояния чекбокса строки
  const toggleRowCheckbox = (fileId) => {
    setCheckedFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  // Обработчик изменения состояния главного чекбокса
  const toggleAllCheckboxes = () => {
    setCheckedFiles(
      checkedFiles.length === data.length ? [] : data.map((row) => row[rowKey])
    );
  };

  // Рендер содержимого ячеек строки
  const renderCellContent = (header, row) => {
    if (header.key === "name") {
      return <GenerateIconWithFileName fileName={row.name} link={row.link} />;
    }

    // Если у заголовка есть ключ 'actions', вызываем renderRowActions
    if (header.key === "isAdmin" && renderRowActions) {
      return renderRowActions(row);
    }

    return row[header.key];
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        {/* Заголовок таблицы */}
        <thead className="table-light">
          <tr>
            {checkbox && (
              <th style={{ width: "40px" }} className="text-center align-middle">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={data.length > 0 && checkedFiles.length === data.length}
                  onChange={toggleAllCheckboxes}
                />
              </th>
            )}
            {headers.map((header, headerIndex) => (
              <th
                key={header.key}
                className={`${
                  headerIndex === 0 ? "text-start ps-5" : "text-center"
                } align-middle`}
              >
                {header.name}
              </th>
            ))}
          </tr>
        </thead>
  
        {/* Тело таблицы */}
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row[rowKey]}
              className={hoveredRow === index ? "table-active" : ""}
              onMouseEnter={() => {
                setHoveredRow(index);
                onRowHover && onRowHover(row);
              }}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => onRowСlick(row.id)}
              
            >
              {checkbox && (
                <td className="text-center align-middle">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkedFiles.includes(row[rowKey])}
                    onChange={() => toggleRowCheckbox(row[rowKey])}
                    onClick={(event) => {
                      event.stopPropagation(); // Останавливаем распространение события
                    }}
                  />
                </td>
              )}
              {headers.map((header, headerIndex) => (
                <td
                  key={header.key}
                  className={`${
                    headerIndex === 0 ? "text-start ps-5" : "text-center"
                  } align-middle`}
                >
                  {renderCellContent(header, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};