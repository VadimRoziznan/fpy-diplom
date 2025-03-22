const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true, // Состояние загрузки
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_AUTH_REQUEST":
      return { ...state, loading: true, error: null };
    case "CHECK_AUTH_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case "CHECK_AUTH_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload.error,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export default authReducer;