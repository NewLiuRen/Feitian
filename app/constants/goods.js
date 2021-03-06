/**
 * 商品表
 * name 名称 
 * description 描述信息
 * cate_index 种类id 
 * sku SKU编码
 * max_count 最大数量
 * is_del 是否删除 
 */
export const GOODS = {
  name: '',
  description: '',
  category_id: null,
  sku: '',
  max_count: null,
  is_del: false,
}

// 为了适配antd的form和redux绑定用
export const GOODS_TMP = {id: null, exist: false}

export default GOODS
