/**
 * 文件表
 * name 名称 
 * description 描述信息 
 * create_date 创建时间
 * is_import 是否被导入，当导入之后，数据冻结，不能进行数量修改
 * is_order 是否输入订单，该标识为true后，证明以生成过箱贴列表
 */
export const FILE = {
  name: '',
  description: '',
  create_date: null,
  is_import: false,
  is_order: false,
}

export default FILE
