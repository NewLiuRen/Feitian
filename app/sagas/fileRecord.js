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

// 修改记录集箱贴
function* updateRecordsOrderNumber({ payload: {file_id, records} }) {
  const res = yield call(recordsDB.updateRecordsOrderNumber, file_id, records);
  if (res.success) yield put(actionTypes.setRecords(res.data.records));
}

export default function* root() {
  yield all([
    takeLatest(actionTypes.FETCH_GET_RECORDS, getRecordByFileId),
    takeLatest(actionTypes.FETCH_ADD_FILE, addFile),
    takeLatest(actionTypes.FETCH_UPDATE_FILE, updateFile),
    takeLatest(actionTypes.FETCH_UPDATE_FILE_IMPORT, updateFileImport),
    takeLatest(actionTypes.FETCH_INIT_RECORDS, initRecords),
    takeLatest(actionTypes.FETCH_ADD_RECORDS, addRecords),
    takeLatest(actionTypes.FETCH_UPDATE_RECORDS, updateRecords),
    takeLatest(actionTypes.FETCH_UPDATE_RECORDS_ORDER_NUMBER, updateRecordsOrderNumber),
  ]);
}
