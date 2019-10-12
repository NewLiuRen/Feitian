// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import warehouse from './warehouse';
import category from './category';

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    warehouse,
    category,
  });
}
