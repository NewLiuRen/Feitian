/**
 * 记录
 * count 数量
 * order_number 订单号
 * goods_id 商品id 
 * warehouse_id 仓库id 
 * labels 箱号[1, 2, 3]
 */
export const RECORD = {
  count: null,
  order_number: '',
  goods_id: null,
  warehouse_id: null,
  labels: [],
}

/**
 * 拼箱
 * label 箱号
 * order_number 订单号
 * warehouse_id 仓库id
 * goods 商品数据[{goods_id: null, count: 0}]
 */
export const SHARE = {
  label: null,
  order_number: '',
  warehouse_id: null,
  goods: null,
}

/**
 * 不满足整箱的剩余商品数量
 * warehouse_id 仓库id
 * goods_id 商品id 
 * count 数量
 */
export const SURPLUS = {
  warehouse_id: null,
  goods_id: null,
  count: null,
}

/**
 * 记录表
 * file_id 文件id
 * records 文件下记录
 * share 拼箱数据
 */
export const RECORDS = {
  file_id: '',
  records: [],
  share: [],
  surplus: [],
}

export default RECORDS
