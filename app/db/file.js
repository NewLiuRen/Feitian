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
  if (db.PRIMARY_KEY in file) delete file[db.PRIMARY_KEY];
  if (!file.create_date) file.create_date = Date.now();
  return new Promise(resolve => {
    db.addData(STORE_NAME, file).then(({success, result}) => {
      file.id = result;
      return resolve({ success, data: file })
    })
  })
}

// 更新文件
export const updateFile = params => getFileById(params.id).then(f => {
    compareObject(fileObj, params);
    const { id, name, description } = params
    const file = Object.assign({}, f, { id, name, description });
    return new Promise(resolve => {
      db.updateData(STORE_NAME, file).then(({success}) => resolve({ success, data: file }))
    })
  })

// 将文件设置为导入状态（导入后记录集数量不可修改，可添加箱贴号）
export const updateFileToImport = params => {
  getFileById(params.id).then(f => {
    compareObject(fileObj, params);
    const { id } = params
    const file = Object.assign({}, f, { id, is_import: true });
    return new Promise(resolve => {
      db.updateData(STORE_NAME, file).then(({success}) => resolve({ success, data: file }))
    })
  })
}

// 删除文件，若存在记录集，则记录集一并删除
export const deleteFile = key => getFileById(key).then(f => {
  if (!f) return { success: false }
  return recordsDB.getRecordsByFileId(f.id)
}).then(r => Promise.all([db.deleteData(STORE_NAME, key), recordsDB.deleteRecords(r.id)])).then(([fileRes, recordsRes]) => ({success: fileRes.success && recordsRes.success}))
