import { compareObject } from '../utils/check'
import * as db from './index'
import warehouseObj from '../constants/warehouse'

const STORE_NAME = 'warehouse'

// 获取所有仓库列表
export const getWarehouses = () => db.getDataList(STORE_NAME).then(list => list)

// 根据id获取仓库
export const getWarehouseById = key => db.getDataById(STORE_NAME, key).then(warehouse => warehouse)

// 添加仓库
export const addWarehouse = params => {
  compareObject(warehouseObj, params);
  const { name, ware_index } = params;
  return db.dataCount(STORE_NAME).then(count => db.addData(STORE_NAME, { name, ware_index: ware_index || ++count })).then(res => res)
}

// 更新仓库
export const updateWarehouse = params => {
  compareObject(warehouseObj, params);
  return db.updateData(STORE_NAME, { ...params }).then(res => res)
}

// 删除仓库
export const deleteWarehouse = key => db.updateData(STORE_NAME, { id: key, is_del: true }).then(res => res)
