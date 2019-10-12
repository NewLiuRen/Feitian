import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actions/warehouse';
import * as db from '../db/warehouse';

// 获取所有仓库列表（不包含冻结）
function* getWarehouseList() {
  const list = yield call(db.getWarehouses);
  yield put(actionTypes.setWarehouseList(list));
}

// 获取所有仓库列表（包含冻结）
function* getWarehouseWithDelList() {
  const list = yield call(db.getWarehousesWithDel);
  yield put(actionTypes.setWarehouseWithDelList(list));
}

// 添加仓库
function* addWarehouse({ payload: warehouse }) {
  const res = yield call(db.addWarehouse, warehouse);
  if (res.success) yield put(actionTypes.addWarehouse(res.data));
}

// 修改仓库
function* updateWarehouse({ payload: warehouse }) {
  const res = yield call(db.updateWarehouse, warehouse);
  if (res.success) yield put(actionTypes.updateWarehouse(res.data));
}

// 冻结仓库
function* freezeWarehouse({ payload }) {
  const listWithDel = yield select(state => state.warehouse.listWithDel);
  const res = yield call(db.freezeWarehouse, payload.id);
  if (res.success) {
    // 成功后list中删除
    yield put(actionTypes.deleteWarehouse(res.data.id));
    // withDelList中重新获取
    if (listWithDel.length > 0) yield put(actionTypes.fetchGetWarehouseWithDelList())
  }
}

// 恢复仓库
function* recoverWarehouse({ payload }) {
  const listWithDel = yield select(state => state.warehouse.listWithDel);
  const { id } = payload
  const res = yield call(db.recoverWarehouse, id);
  if (res.success) {
    yield put(actionTypes.fetchGetWarehouseList());
    if (listWithDel.length > 0) yield put(actionTypes.fetchGetWarehouseWithDelList())  
  }
}

export default function* root() {
  yield all([
    takeLatest(actionTypes.FETCH_GET_WAREHOUSE_LIST, getWarehouseList),
    takeLatest(actionTypes.FETCH_GET_WAREHOUSE_WITH_DEL_LIST, getWarehouseWithDelList),
    takeLatest(actionTypes.FETCH_ADD_WAREHOUSE, addWarehouse),
    takeLatest(actionTypes.FETCH_UPDATE_WAREHOUSE, updateWarehouse),
    takeLatest(actionTypes.FETCH_FREEZE_WAREHOUSE, freezeWarehouse),
    takeLatest(actionTypes.FETCH_RECOVER_WAREHOUSE, recoverWarehouse),
  ]);
}
