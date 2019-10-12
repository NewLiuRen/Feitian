import { all, fork } from 'redux-saga/effects';

import warehouse from './warehouse';
import category from './category';

export default function* root() {
  yield all([fork(warehouse), fork(category)]);
}
