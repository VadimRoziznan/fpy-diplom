/*import history from '../../utils/history';

const navigationMiddleware = () => (store) => (next) => (action) => {
  if (action.type === 'login/fetchLoginSuccess') {
    const userId = action.payload?.id; // Получаем userId из action.payload

    if (userId) {
      // Перенаправляем на /storage/:id
      history.push(`/storage/${userId}`);
    } else {
      console.error('Не удалось получить userId для перенаправления.');
    }
  }

  return next(action);
};

export default navigationMiddleware;*/
