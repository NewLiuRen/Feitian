import { compareObject } from '../utils/check'
import * as db from './index'
import * as fileDB from './file'
import recordsObj, { RECORD } from '../constants/records'

const STORE_NAME = 'records'
const recordObj = Object.assign({}, RECORD)

// 根据file_id获取文件
export const getRecordsByFileId = key => db.getDateByIndex(STORE_NAME, 'file_id', key).then(res => res);

// 添加记录
export const addFileRecords = (file_id, params) => fileDB.getFileById(file_id).then(file => {
    if (!file || file.is_import) return { success: false, msg: '不存在文件或文件已导入至京东后台' }
    if (!Array.isArray(params)) params = [params];
    params.forEach(p => {
      compareObject(recordObj, p)
      if (db.PRIMARY_KEY in p) delete p[db.PRIMARY_KEY];
    });
    const recordsArr = params.map(p => {
      const { count, max_count, goods_id, warehouse_id } = p
      return Object.assign({}, recordObj, { count, max_count, goods_id: parseInt(goods_id, 10), warehouse_id: parseInt(warehouse_id, 10) })
    });
    const records = Object.assign({}, recordsObj, {file_id, records: recordsArr});
    return new Promise(resolve => {
      db.addData(STORE_NAME, records).then(({success, result}) => resolve({ success, data: records }))
    })
  })

// 更新记录
export const updateRecords = (file_id, params) => fileDB.getFileById(file_id).then(file => {
  if (!file || file.is_import) return { success: false }
  return db.getDateByIndex(STORE_NAME, 'file_id', file_id)
}).then(rs => {
  if (!Array.isArray(params)) params = [params];
  params.forEach(p => compareObject(recordObj, p));

  const recordsArr = params.map(p => {
    const { count, max_count, goods_id, warehouse_id } = p
    return Object.assign({}, recordObj, { count, max_count, goods_id: parseInt(goods_id, 10), warehouse_id: parseInt(warehouse_id, 10) })
  });

  const uRecords = Object.assign({}, rs, {records: recordsArr})

  return new Promise(resolve => {
    db.updateData(STORE_NAME, uRecords).then(({success, result}) => resolve({ success, data: uRecords }))
  })
})

// 设置记录箱号
export const updateRecordsOrderNumber = (file_id, params) => fileDB.getFileById(file_id).then(file => {
  if (!file || file.is_import) return { success: false }
  return db.getDateByIndex(STORE_NAME, 'file_id', file_id)
}).then(rs => {
  if (!Array.isArray(params)) params = [params];
  params.forEach(p => compareObject(recordObj, p));
  const { records } = rs;

  params.forEach((p, i) => {
    if (records.find(r => (r.goods_id == p.goods_id && r.warehouse_id == p.warehouse_id))) {
      const { order_number } = p
      records[i] = Object.assign({}, records[i], { order_number });
    }
  })
  
  const uRecords = Object.assign({}, rs, {records});

  return new Promise(resolve => {
    db.updateData(STORE_NAME, uRecords).then(({success, result}) => resolve({ success, data: uRecords }))
  })
})

// 删除记录集
export const deleteRecords = id => db.deleteData(STORE_NAME, id).then(({success}) => ({ success }))

// 用file_id删除记录集
export const deleteRecordsByFileId = file_id => getRecordsByFileId(file_id).then(rs => {
    if (!rs) return { success: false }
    return db.deleteData(STORE_NAME, rs.id)
  }).then(({success}) => ({ success }))
