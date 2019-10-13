import { compareObject } from '../utils/check'
import * as db from './index'
import * as recordsDB from './records'
import fileObj from '../constants/file'

const STORE_NAME = 'file'

// 按照日期范围获取所有文件列表
export const getFileListByDate = (startDate, endDate) => db.getRangeDataByIndex(STORE_NAME, 'create_date', {ge: startDate, le: endDate}).then(list => list);

// 根据id获取文件
export const getFileById = key => db.getDataById(STORE_NAME, key).then(file => file);

// 添加文件
export const addFile = params => {
  compareObject(fileObj, params);
  const file = Object.assign({}, fileObj, params);
  return new Promise(resolve => {
    db.addData(STORE_NAME, file).then(({success, result}) => {
      file.id = result;
      resolve({ success, data: file })
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

// TODO: 删除文件
export const deleteFile = key => getFileById(key).then(f => {
  if (!f) return { success: false }
  return recordsDB.getRecordsByFileId(f.id)
}).then(r => {
  console.log('r :', r);
})
