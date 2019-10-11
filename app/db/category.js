import { compareObject } from '../utils/check'
import * as db from './index'
import categoryObj from '../constants/category'

const STORE_NAME = 'category'

// 获取所有类别列表
export const getCategory = () => db.getDataList(STORE_NAME).then(list => list)

// 添加类别
export const addCategory = params => {
  compareObject(categoryObj, params);
  const { name } = params;
  return db.addData(STORE_NAME, { name }).then(res => res)
}

// 更新类别
export const updateCategory = params => {
  compareObject(categoryObj, params);
  return db.updateData(STORE_NAME, { ...params }).then(res => res);
}

// 删除类别
export const deleteCategory = key => db.updateData(STORE_NAME, { id: key, is_del: true }).then(res => res)
