import { compareObject } from '../utils/check'
import * as db from './index'
import warehouseObj from '../constants/warehouse'

const STORE_NAME = 'warehouse'

// 获取所有未冻结仓库列表
export const getWarehouses = () => db.getDataList(STORE_NAME).then(list => list.filter(w => w.is_del === false));

// 获取所有仓库列表
export const getWarehousesWithDel = () => db.getDataList(STORE_NAME).then(list => list);

// 根据id获取仓库
export const getWarehouseById = key => db.getDataById(STORE_NAME, key).then(warehouse => warehouse);

// 添加仓库
export const addWarehouse = params => {
  compareObject(warehouseObj, params);
  const warehouse = Object.assign({}, warehouseObj, params);
  if (db.PRIMARY_KEY in warehouse) delete warehouse[db.PRIMARY_KEY];

  return db.dataCount(STORE_NAME).then(count => {
    if (!warehouse.warehouse_index) warehouse.warehouse_index = count + 1;
    return new Promise(resolve => {
      db.addData(STORE_NAME, warehouse).then(({success, result}) => {
        warehouse.id = result;
        return resolve({ success, data: warehouse })
      })
    })
  });
}

// 更新仓库
export const updateWarehouse = params => {
  return getWarehouseById(params.id).then(w => {
    compareObject(warehouseObj, params);
    const warehouse = Object.assign({}, w, params);
    return new Promise(resolve => {
      db.updateData(STORE_NAME, warehouse).then(({success}) => resolve({ success, data: warehouse }))
    })
  })
}

// 冻结仓库
export const freezeWarehouse = key => getWarehouseById(key).then(w => {
    if (!w) return { success: false }
    const warehouse = Object.assign({}, warehouseObj, w);
    warehouse.is_del = true;
    return new Promise(resolve => {
      db.updateData(STORE_NAME, warehouse).then(({success}) => resolve({ success, data: warehouse }))
    })
  })

// 恢复仓库
export const recoverWarehouse = key => getWarehouseById(key).then(w => {
  if (!w) return { success: false }
  const warehouse = Object.assign({}, warehouseObj, w);
  warehouse.is_del = false;
  return new Promise(resolve => {
    db.updateData(STORE_NAME, warehouse).then(({success}) => resolve({ success, data: warehouse }))
  })
})
