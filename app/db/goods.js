import { compareObject } from '../utils/check'
import * as db from './index'
import goodsObj from '../constants/goods'

const STORE_NAME = 'goods'

// 获取所有商品列表
export const getGoods = () => db.getDataList(STORE_NAME).then(list => list)

// 按照类别查询商品列表

// 按照sku查询指定商品

// 按照商品名称查询指定商品

// 添加商品
export const addGoods = params => {
  compareObject(goodsObj, params);
  const { name, category_id, sku } = params;
  return db.addData(STORE_NAME, { name, category_id, sku }).then(res => res)
}

// 更新商品
export const updateGoods = params => {
  compareObject(goodsObj, params);
  return db.updateData(STORE_NAME, { ...params }).then(res => res);
}

// 删除商品
export const deleteGoods = key => db.updateData(STORE_NAME, { id: key, is_del: true }).then(res => res)
