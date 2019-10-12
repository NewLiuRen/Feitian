import { compareObject } from '../utils/check'
import * as db from './index'
import categoryObj from '../constants/category'

const STORE_NAME = 'category'

// 获取所有未冻结种类列表
export const getCategory = () => db.getDataList(STORE_NAME).then(list => list.filter(w => w.is_del === false));

// 获取所有种类列表
export const getCategoryWithDel = () => db.getDataList(STORE_NAME).then(list => list);

// 根据id获取种类
export const getCategoryById = key => db.getDataById(STORE_NAME, key).then(category => category);

// 添加种类
export const addCategory = params => {
  compareObject(categoryObj, params);
  const category = Object.assign({}, categoryObj, params);
  return new Promise(resolve => {
    db.addData(STORE_NAME, category).then(({success, result}) => {
      category.id = result;
      resolve({ success, data: category })
    })
  })
}

// 更新种类
export const updateCategory = params => {
  compareObject(categoryObj, params);
  const category = Object.assign({}, categoryObj, params);
  return new Promise(resolve => {
    db.updateData(STORE_NAME, category).then(({success}) => resolve({ success, data: category }))
  })
}

// 冻结种类
export const freezeCategory = key => getCategoryById(key).then(w => {
    if (!w) return { success: false }
    const category = Object.assign({}, categoryObj, w);
    category.is_del = true;
    return new Promise(resolve => {
      db.updateData(STORE_NAME, category).then(({success}) => {
        resolve({ success, data: category })
      })
    })
  })

// 恢复种类
export const recoverCategory = key => getCategoryById(key).then(w => {
  if (!w) return { success: false }
  const category = Object.assign({}, categoryObj, w);
  category.is_del = false;
  return new Promise(resolve => {
    db.updateData(STORE_NAME, category).then(({success}) => {
      resolve({ success, data: category })
    })
  })
})
