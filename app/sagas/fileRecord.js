import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { RECORD } from '../constants/records';
import * as actionTypes from '../actions/fileRecord';
import * as fileDB from '../db/file';
import * as recordsDB from '../db/records';

// 获取记录集
function* getRecordByFileId({ payload: file }) {
  const res = yield call(recordsDB.getRecordsByFileId, file.id);
  yield put(actionTypes.setRecords(res.records));
}

// 添加文件
function* addFile({ payload: file }) {
  const res = yield call(fileDB.addFile, file);
  if (res.success) yield put(actionTypes.setFile(res.data));
}

// 修改文件
function* updateFile({ payload: file }) {
  const res = yield call(fileDB.updateFile, file);
  if (res.success) yield put(actionTypes.setFile(res.data));
}

// 修改文件为导入状态
function* updateFileImport({ payload: file }) {
  const res = yield call(fileDB.updateFileToImport, file);
  if (res.success) yield put(actionTypes.setFile(res.data));
}

// 修改文件为订单录入完成状态
function* updateFileOrder({ payload: file }) {
  const res = yield call(fileDB.updateFileToOrder, file);
  if (res.success) yield put(actionTypes.setFile(res.data));
}

// 初始化记录集
function* initRecords({ payload: { file_id, warehouseIdList, goodsIdList } }) {
  const records = []
  warehouseIdList.forEach(w => {
    goodsIdList.forEach(g =>{
      records.push(Object.assign({}, RECORD, {goods_id: g,
        warehouse_id: w,}))
    })
  })
  const res = yield call(recordsDB.addFileRecords, file_id, records);
  if (res.success) yield put(actionTypes.setRecords(res.data.records));
}

// 追加记录集
function* addToRecords({ payload: { file_id, warehouseIdList, goodsIdList } }) {
  const records = []
  warehouseIdList.forEach(w => {
    goodsIdList.forEach(g =>{
      records.push(Object.assign({}, RECORD, {goods_id: g,
        warehouse_id: w,}))
    })
  })
  const res = yield call(recordsDB.addToRecords, file_id, records);
  if (res.success) yield put(actionTypes.setRecords(res.data.records));
}

// 添加记录集
function* addRecords({ payload: {file_id, records} }) {
  const res = yield call(recordsDB.addFileRecords, file_id, records);
  if (res.success) yield put(actionTypes.setRecords(res.data.records));
}

// 修改记录集
function* updateRecords({ payload: {file_id, records} }) {
  const res = yield call(recordsDB.updateRecords, file_id, records);
  if (res.success) yield put(actionTypes.setRecords(res.data.records));
}

// 删除记录集
function* deleteRecords({ payload: {file_id, records} }) {
  const res = yield call(recordsDB.deleteRecords, file_id, records);
  if (res.success) yield put(actionTypes.setRecords(res.data.records));
}

// 添加记录集箱贴
function* addRecordsOrderNumber({ payload: {file_id, warehouse_id, goodsIdList, order_number} }) {
  const rs = yield call(recordsDB.getRecordsByFileId, file_id);
  const uRecords = rs.records.map(r => {
    if (parseInt(r.warehouse_id, 10) === parseInt(warehouse_id, 10) && goodsIdList.find(gid => parseInt(r.goods_id, 10) === parseInt(gid, 10))) return Object.assign({}, r, {order_number})
    return r;
  })
  
  const res = yield call(recordsDB.updateRecordsOrderNumber, file_id, uRecords);
  if (res.success) yield put(actionTypes.setRecords(res.data.records));
}

// 修改记录集箱贴
function* updateRecordsOrderNumber({ payload: {file_id, warehouse_id, goodsIdList, old_order_number, order_number} }) {
  const rs = yield call(recordsDB.getRecordsByFileId, file_id);
  const uRecords = rs.records.map(r => {
    if (parseInt(r.warehouse_id, 10) === parseInt(warehouse_id, 10)) {
      // 若原订单号相同且存在于id列表中，则将订单号修改为新订单号
      // 若原订单号相同但不存在与id列表中，说明为移除状态，将订单号置为空
      if (goodsIdList.includes(parseInt(r.goods_id, 10))) return Object.assign({}, r, {order_number})
      if (!goodsIdList.includes(parseInt(r.goods_id, 10)) && parseInt(r.order_number, 10) === parseInt(old_order_number, 10)) return Object.assign({}, r, {order_number: ''})
    }
    return r;
  })
  const res = yield call(recordsDB.updateRecordsOrderNumber, file_id, uRecords);
  if (res.success) yield put(actionTypes.setRecords(res.data.records));
}

// 修改单个记录箱贴
function* changeRecordOrderNumber({ payload: {file_id, warehouse_id, goods_id, order_number} }) {
  const rs = yield call(recordsDB.getRecordsByFileId, file_id);
  const uRecords = rs.records.map(r => {
    if (parseInt(r.warehouse_id, 10) === parseInt(warehouse_id, 10) && parseInt(r.goods_id, 10) === parseInt(goods_id, 10)) {
      return Object.assign({}, r, {order_number})
    }
    return r;
  })
  const res = yield call(recordsDB.updateRecordsOrderNumber, file_id, uRecords);
  if (res.success) yield put(actionTypes.setRecords(res.data.records));
}

// 删除记录集箱贴
function* deleteRecordsOrderNumber({ payload: {file_id, warehouse_id, goodsIdList, order_number} }) {
  const rs = yield call(recordsDB.getRecordsByFileId, file_id);
  const uRecords = rs.records.map(r => {
    if (parseInt(r.warehouse_id, 10) === parseInt(warehouse_id, 10) && goodsIdList.find(gid => parseInt(r.goods_id, 10) === parseInt(gid, 10))) return Object.assign({}, r, {order_number: ''})
    return r;
  })
  
  const res = yield call(recordsDB.updateRecordsOrderNumber, file_id, uRecords);
  if (res.success) yield put(actionTypes.setRecords(res.data.records));
}

// 生成整箱箱贴
function* generateFullBoxLabels({ payload: file }) {
  const goodsMap = yield select(state => state.goods.map);
  const res = yield call(recordsDB.generateFullBoxLabelByFileId, file.id, goodsMap);
  if (res.success) {
    yield put(actionTypes.setShare(res.data.share));
    yield put(actionTypes.setSurplus(res.data.surplus));
  }
}

// 添加一条拼箱箱贴
function* addShareLabel({ payload: {file_id, label, order_number, warehouse_id, goods} }) {
  const res = yield call(recordsDB.addFileShare, file_id, {label, order_number, warehouse_id, goods});
  if (res.success) yield put(actionTypes.setShare(res.data.share));
}

// 删除一条拼箱箱贴
function* deleteShareLabel({ payload: {file_id, label, warehouse_id,} }) {
  const res = yield call(recordsDB.deleteFileShare, file_id, {label,  warehouse_id,});
  if (res.success) yield put(actionTypes.setShare(res.data.share));
}

// 清空拼箱數據
function* clearShareLabel({ payload: {file_id} }) {
  const res = yield call(recordsDB.clearFileShare, file_id);
  if (res.success) yield put(actionTypes.setShare(res.data.share));
}

export default function* root() {
  yield all([
    takeLatest(actionTypes.FETCH_GET_RECORDS, getRecordByFileId),
    takeLatest(actionTypes.FETCH_ADD_FILE, addFile),
    takeLatest(actionTypes.FETCH_UPDATE_FILE, updateFile),
    takeLatest(actionTypes.FETCH_UPDATE_FILE_IMPORT, updateFileImport),
    takeLatest(actionTypes.FETCH_UPDATE_FILE_ORDER, updateFileOrder),
    takeLatest(actionTypes.FETCH_INIT_RECORDS, initRecords),
    takeLatest(actionTypes.FETCH_ADD_TO_RECORDS, addToRecords),
    takeLatest(actionTypes.FETCH_ADD_RECORDS, addRecords),
    takeLatest(actionTypes.FETCH_UPDATE_RECORDS, updateRecords),
    takeLatest(actionTypes.FETCH_DELETE_RECORDS, deleteRecords),
    takeLatest(actionTypes.FETCH_ADD_RECORDS_ORDER_NUMBER, addRecordsOrderNumber),
    takeLatest(actionTypes.FETCH_UPDATE_RECORDS_ORDER_NUMBER, updateRecordsOrderNumber),
    takeLatest(actionTypes.FETCH_CHANGE_RECORD_ORDER_NUMBER, changeRecordOrderNumber),
    takeLatest(actionTypes.FETCH_DELETE_RECORDS_ORDER_NUMBER, deleteRecordsOrderNumber),
    takeLatest(actionTypes.FETCH_GENERATE_FULL_BOX_LABELS, generateFullBoxLabels),
    takeLatest(actionTypes.FETCH_ADD_SHARE, addShareLabel),
    takeLatest(actionTypes.FETCH_DELETE_SHARE, deleteShareLabel),
    takeLatest(actionTypes.FETCH_CLEAR_SHARE, clearShareLabel),
  ]);
}
