// @flow
import { createStore, applyMiddleware } from 'redux';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import createRootReducer from '../reducers';
import rootSaga from '../sagas';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(sagaMiddleware, router);

function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  sagaMiddleware.run(rootSaga);
  return store;
}

export default { configureStore, history };
