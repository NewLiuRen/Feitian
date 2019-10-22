import { compareObject } from '../utils/check'
import * as db from './index'
import goodsObj from '../constants/goods'

const STORE_NAME = 'goods'

// 获取所有未冻结商品列表
export const getGoods = () => db.getDataList(STORE_NAME).then(list => list.filter(g => g.is_del === false));

// 获取所有商品列表
export const getGoodsWithDel = () => db.getDataList(STORE_NAME).then(list => list);

// 根据id获取商品
export const getGoodsById = key => db.getDataById(STORE_NAME, key).then(goods => goods);

// 按照类别查询商品列表
export const getGoodsByCategoryId = categoryId => db.getRangeDataByIndex(STORE_NAME, 'category_id', {eq: parseInt(categoryId, 10)}).then(list => list)

// 按照sku查询指定商品
export const getGoodsBySku = sku => db.getDateByIndex(STORE_NAME, 'sku', sku).then(goods => goods)

// 按照商品名称查询指定商品
export const getGoodsByName = name => db.getDateByIndex(STORE_NAME, 'name', name).then(goods => goods)

// 添加商品
export const addGoods = params => {
  compareObject(goodsObj, params);
  const goods = Object.assign({}, goodsObj, params);
  if (db.PRIMARY_KEY in goods) delete goods[db.PRIMARY_KEY];

  if (goods.category_id) goods.category_id = parseInt(goods.category_id, 10)
  return new Promise(resolve => {
    db.addData(STORE_NAME, goods).then(({success, result}) => {
      goods.id = result;
      return resolve({ success, data: goods })
    })
  })
}

// 更新商品
export const updateGoods = params => {
  return getGoodsById(params.id).then(g => {
    compareObject(goodsObj, params);
    const goods = Object.assign({}, g, params);
    if (goods.category_id) goods.category_id = parseInt(goods.category_id, 10)
    return new Promise(resolve => {
      db.updateData(STORE_NAME, goods).then(({success}) => resolve({ success, data: goods }))
    })
  })
}

// 冻结商品
export const freezeGoods = key => getGoodsById(key).then(g => {
    if (!g) return { success: false }
    const goods = Object.assign({}, goodsObj, g);
    goods.is_del = true;
    return new Promise(resolve => {
      db.updateData(STORE_NAME, goods).then(({success}) => resolve({ success, data: goods }))
    })
  })

// 恢复商品
export const recoverGoods = key => getGoodsById(key).then(g => {
  if (!g) return { success: false }
  const goods = Object.assign({}, goodsObj, g);
  goods.is_del = false;
  return new Promise(resolve => {
    db.updateData(STORE_NAME, goods).then(({success}) => resolve({ success, data: goods }))
  })
})
