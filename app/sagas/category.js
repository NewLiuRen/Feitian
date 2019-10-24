import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actions/category';
import * as db from '../db/category';

// 获取所有类目列表（不包含冻结）
function* getCategoryList() {
  const list = yield call(db.getCategory);
  yield put(actionTypes.setCategoryList(list));
  yield put(actionTypes.setMap());
}

// 获取所有类目列表（包含冻结）
function* getCategoryWithDelList() {
  const list = yield call(db.getCategoryWithDel);
  yield put(actionTypes.setCategoryWithDelList(list));
}

// 添加类目
function* addCategory({ payload: category }) {
  const res = yield call(db.addCategory, category);
  if (res.success) {
    yield put(actionTypes.addCategory(res.data));
    yield put(actionTypes.setMap());
  }
}

// 修改类目
function* updateCategory({ payload: category }) {
  const res = yield call(db.updateCategory, category);
  if (res.success) {
    yield put(actionTypes.updateCategory(res.data));
    yield put(actionTypes.setMap());
  }
}

// 冻结类目
function* freezeCategory({ payload }) {
  const listWithDel = yield select(state => state.category.listWithDel);
  const res = yield call(db.freezeCategory, payload.id);
  if (res.success) {
    // 成功后list中删除
    yield put(actionTypes.deleteCategory(res.data.id));
    // withDelList中重新获取
    if (listWithDel.length > 0) yield put(actionTypes.fetchGetCategoryWithDelList())
  }
}

// 恢复类目
function* recoverCategory({ payload }) {
  const listWithDel = yield select(state => state.category.listWithDel);
  const { id } = payload
  const res = yield call(db.recoverCategory, id);
  if (res.success) {
    yield put(actionTypes.fetchGetCategoryList());
    if (listWithDel.length > 0) yield put(actionTypes.fetchGetCategoryWithDelList())  
  }
}

export default function* root() {
  yield all([
    takeLatest(actionTypes.FETCH_GET_CATEGORY_LIST, getCategoryList),
    takeLatest(actionTypes.FETCH_GET_CATEGORY_WITH_DEL_LIST, getCategoryWithDelList),
    takeLatest(actionTypes.FETCH_ADD_CATEGORY, addCategory),
    takeLatest(actionTypes.FETCH_UPDATE_CATEGORY, updateCategory),
    takeLatest(actionTypes.FETCH_FREEZE_CATEGORY, freezeCategory),
    takeLatest(actionTypes.FETCH_RECOVER_CATEGORY, recoverCategory),
  ]);
}
