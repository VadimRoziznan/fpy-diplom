import history from '../../utils/history';

const navigationMiddleware = () => (store) => (next) => (action) => {
  if (action.type === 'login/fetchLoginSuccess') {
    // Навигация на главную страницу
    console.log('Переход на главную страницу');
    history.push('/storage'); // Используем history вместо useNavigate
  }

  return next(action);
};

export default navigationMiddleware;