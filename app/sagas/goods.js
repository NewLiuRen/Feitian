import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actions/goods';
import * as db from '../db/goods';

// 获取所有商品列表（不包含冻结）
function* getGoodsList() {
  const list = yield call(db.getGoods);
  yield put(actionTypes.setGoodsList(list));
  yield setGoodsWithDelMap();
}

// 获取所有商品列表（包含冻结）
function* getGoodsWithDelList() {
  const list = yield call(db.getGoodsWithDel);
  yield put(actionTypes.setGoodsWithDelList(list));
}

// 设置商品列表映射（包含冻结）
function* setGoodsWithDelMap() {
  const list = yield call(db.getGoodsWithDel);
  yield put(actionTypes.setGoodsMap(list));
}

// 添加商品
function* addGoods({ payload: goods }) {
  const res = yield call(db.addGoods, goods);
  if (res.success) {
    yield put(actionTypes.addGoods(res.data));
    // 添加后重置商品映射关系
    yield setGoodsWithDelMap();
  }
}

// 修改商品
function* updateGoods({ payload: goods }) {
  const res = yield call(db.updateGoods, goods);
  if (res.success) {
    yield put(actionTypes.updateGoods(res.data));
    // 修改后重置商品映射关系
    yield setGoodsWithDelMap();
  }
}

// 冻结商品
function* freezeGoods({ payload }) {
  const listWithDel = yield select(state => state.goods.listWithDel);
  const res = yield call(db.freezeGoods, payload.id);
  if (res.success) {
    // 成功后list中删除
    yield put(actionTypes.deleteGoods(res.data.id));
    // withDelList中重新获取
    if (listWithDel.length > 0) yield put(actionTypes.fetchGetGoodsWithDelList())
  }
}

// 恢复商品
function* recoverGoods({ payload }) {
  const listWithDel = yield select(state => state.goods.listWithDel);
  const { id } = payload
  const res = yield call(db.recoverGoods, id);
  if (res.success) {
    yield put(actionTypes.fetchGetGoodsList());
    if (listWithDel.length > 0) yield put(actionTypes.fetchGetGoodsWithDelList())  
  }
}

export default function* root() {
  yield all([
    takeLatest(actionTypes.FETCH_GET_GOODS_LIST, getGoodsList),
    takeLatest(actionTypes.FETCH_GET_GOODS_WITH_DEL_LIST, getGoodsWithDelList),
    takeLatest(actionTypes.FETCH_ADD_GOODS, addGoods),
    takeLatest(actionTypes.FETCH_UPDATE_GOODS, updateGoods),
    takeLatest(actionTypes.FETCH_FREEZE_GOODS, freezeGoods),
    takeLatest(actionTypes.FETCH_RECOVER_GOODS, recoverGoods),
  ]);
}
