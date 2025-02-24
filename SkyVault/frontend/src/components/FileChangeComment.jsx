import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  changeFileCommentRequest,
  changeFileCommentSuccess,
  changeFileCommentFailure,
} from "../redux/reducers/fileManagerSlice";
import Swal from "sweetalert2";

const FileChangeComment = ({ fileId, userId, onClose }) => {
  const [newComment, setComment] = useState("");
  const dispatch = useDispatch();

  const fileAddComment = async () => {
    try {
      dispatch(changeFileCommentRequest({ userId, fileId, newComment }));

      onClose(); // Закрыть модальное окно
    } catch (error) {
      dispatch(changeFileCommentFailure(error.message));

      Swal.fire({
        icon: "error",
        title: "Ошибка изменения комментария",
        text:
          error.message || "Произошла неизвестная ошибка. Попробуйте снова.",
      });
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Изменить комментарий</h5>
          </div>
          <div className="modal-body">
            <textarea
              className="form-control"
              value={newComment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Введите ваш комментарий"
            ></textarea>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Закрыть
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={fileAddComment}
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileChangeComment;
