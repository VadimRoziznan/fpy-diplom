import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/rootReducer';
import rootSaga from './sagas/rootSaga';
import navigationMiddleware from '../redux/middlewares/navigationMiddleware';

// Create the Saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure the Redux store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware).concat(navigationMiddleware()),
});

// Run the root saga
sagaMiddleware.run(rootSaga);

export default store;
