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
      const { count, goods_id, warehouse_id } = p
      return Object.assign({}, recordObj, { count, goods_id: parseInt(goods_id, 10), warehouse_id: parseInt(warehouse_id, 10) })
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

  const recordsArr = rs.records.map(r => {
    const index = params.findIndex(p => (parseInt(p.warehouse_id, 10) === parseInt(r.warehouse_id, 10) && parseInt(p.goods_id, 10) === parseInt(r.goods_id, 10)))
    if (index !== -1) {
      const { count, goods_id, warehouse_id } = params[index];
      return Object.assign({}, recordObj, { count, goods_id: parseInt(goods_id, 10), warehouse_id: parseInt(warehouse_id, 10) });
    } 
      return r
    
  });

  const uRecords = Object.assign({}, rs, {records: recordsArr})

  return new Promise(resolve => {
    db.updateData(STORE_NAME, uRecords).then(({success, result}) => resolve({ success, data: uRecords }))
  })
})

// 追加记录
export const addToRecords = (file_id, params) => fileDB.getFileById(file_id).then(file => {
  if (!file || file.is_import) return { success: false }
  return db.getDateByIndex(STORE_NAME, 'file_id', file_id)
}).then(rs => {
  if (!Array.isArray(params)) params = [params];
  params.forEach(p => compareObject(recordObj, p));

  let recordsArr = params.filter(p => {
    if (rs.records.find(r => parseInt(p.goods_id, 10) === parseInt(r.goods_id, 10) && parseInt(p.warehouse_id, 10) === parseInt(r.warehouse_id, 10))) {
      return null
    } 
    return p
  });
  recordsArr = rs.records.concat(recordsArr); 
  const uRecords = Object.assign({}, rs, {records: recordsArr});

  return new Promise(resolve => {
    db.updateData(STORE_NAME, uRecords).then(({success, result}) => resolve({ success, data: uRecords }))
  })
})

// 删除记录集
export const deleteRecords = (file_id, params) => fileDB.getFileById(file_id).then(file => {
  if (!file || file.is_import) return { success: false }
  return db.getDateByIndex(STORE_NAME, 'file_id', file_id)
}).then(rs => {
  if (!Array.isArray(params)) params = [params];
  params.forEach(p => compareObject(recordObj, p));
  const recordsArr = [];
  for (const r of rs.records) {
    const index = params.findIndex(p => (parseInt(p.warehouse_id, 10) === parseInt(r.warehouse_id, 10) && parseInt(p.goods_id, 10) === parseInt(r.goods_id, 10)))
    if (index === -1) {
      recordsArr.push(r)
    }
  }

  const uRecords = Object.assign({}, rs, {records: recordsArr})

  return new Promise(resolve => {
    db.updateData(STORE_NAME, uRecords).then(({success, result}) => resolve({ success, data: uRecords }))
  })
})

// 设置记录箱号
export const updateRecordsOrderNumber = (file_id, params) => fileDB.getFileById(file_id).then(file => {
  if (!file || !file.is_import) return null
  return db.getDateByIndex(STORE_NAME, 'file_id', file_id)
}).then(rs => {
  if (!rs) throw new Error('不存在文件，或文件导入状态错误');
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
export const deleteAllRecords = id => db.deleteData(STORE_NAME, id).then(({success}) => ({ success }))

// 用file_id删除记录集
export const deleteAllRecordsByFileId = file_id => getRecordsByFileId(file_id).then(rs => {
    if (!rs) return { success: false }
    return db.deleteData(STORE_NAME, rs.id)
  }).then(({success}) => ({ success }))

// 生成整箱箱贴号
export const generateFullBoxLabelByFileId = file_id => getRecordsByFileId(file_id).then(rs => {
    if (!rs) return { success: false }
    const recordsWarehouseMap = {}
    rs.records.forEach(r => {
      if (!recordsWarehouseMap[r.warehouse_id]) recordsWarehouseMap[r.warehouse_id] = [];
      recordsWarehouseMap[r.warehouse_id].push(r);
    })
console.log('recordsWarehouseMap :', recordsWarehouseMap);
    const records = Object.entries(recordsWarehouseMap).map(([wid, rArr]) => {
      let index = 1;
      return rArr.sort((p, c) => p.goods_id - c.goods_id).map(r => {
        const boxCount = Math.floor(r.count / r.max_count);
        const labels = []
        for(let i=0, len=boxCount; i<len ; i+=1) {
          labels.push(index);
          index += 1;
        }
        return Object.assign({}, r, {labels})
      })
    }).flat()
console.log('records :', records);
    const uRecords = Object.assign({}, rs, {records});
console.log('uRecords :', uRecords);
    return new Promise(resolve => {
      db.updateData(STORE_NAME, uRecords).then(({success, result}) => resolve({ success, data: uRecords }))
    })
  })
