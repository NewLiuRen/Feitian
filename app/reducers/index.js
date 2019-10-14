// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import warehouse from './warehouse';
import category from './category';
import goods from './goods';
import fileRecord from './fileRecord';

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    warehouse,
    category,
    goods,
    fileRecord,
  });
}
