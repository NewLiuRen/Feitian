import { compareObject } from '../utils/check'
import * as db from './index'
import * as fileDB from './file'
import recordsObj, { RECORD } from '../constants/records'

const STORE_NAME = 'records'
const recordObj = Object.assign({}, RECORD)

// 根据file_id获取文件
export const getRecordsByFileId = key => db.getDateByIndex(STORE_NAME, 'file_id', key).then(res => res);

// 添加记录
export const addFileRecords = (file_id, params) => {
  return fileDB.getFileById(file_id).then(file => {
    console.log('file :', file);
    if (!file || file.is_import) return { success: false }
    if (!Array.isArray(params)) params = [params];
    params.forEach(p => compareObject(recordObj, p));
    const recordsArr = params.map(p => Object.assign({}, recordObj, p));
    const records = Object.assign({}, recordsObj, {file_id, records: recordsArr});
    console.log('records :', records);
    return new Promise(resolve => {
      db.addData(STORE_NAME, records).then(({success, result}) => {
        // file.id = result;
        console.log('addFileRecords result :', result);
        resolve({ success, data: file })
      })
    })
  })
}

// 更新文件
export const updateFile = params => {
  compareObject(fileObj, params);
  const file = Object.assign({}, fileObj, params);
  return new Promise(resolve => {
    db.updateData(STORE_NAME, file).then(({success}) => resolve({ success, data: file }))
  })
}

// 冻结文件
export const freezeFile = key => getFileById(key).then(f => {
    if (!f) return { success: false }
    const file = Object.assign({}, fileObj, f);
    file.is_del = true;
    return new Promise(resolve => {
      db.updateData(STORE_NAME, file).then(({success}) => {
        resolve({ success, data: file })
      })
    })
  })
