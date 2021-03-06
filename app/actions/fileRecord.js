export const SET_FILE = 'SET_FILE';
export const SET_RECORDS = 'SET_RECORDS';
export const SET_SHARE = 'SET_SHARE';
export const SET_SURPLUS = 'SET_SURPLUS';
export const ADD_FILE_GOODS = 'ADD_FILE_GOODS';
export const ADD_TO_FILE_GOODS = 'ADD_TO_FILE_GOODS';
export const REMOVE_FILE_GOODS = 'REMOVE_FILE_GOODS';
export const SET_FILE_GOODS = 'SET_FILE_GOODS';
export const SET_ALL_FILE_GOODS_EXIST = 'SET_ALL_FILE_GOODS_EXIST';
export const SET_FILE_ALL_GOODS = 'SET_FILE_ALL_GOODS';
export const SET_FILE_ALL_WAREHOUSE = 'SET_FILE_ALL_WAREHOUSE';
export const UPDATE_FILE = 'UPDATE_FILE';
export const UPDATE_FILE_IMPORT = 'UPDATE_FILE_IMPORT';
export const ADD_RECORDS = 'ADD_RECORDS';
export const UPDATE_RECORDS = 'UPDATE_RECORDS';
export const UPDATE_RECORDS_ORDER_NUMBER = 'UPDATE_RECORDS_ORDER_NUMBER';
export const CLEAR_FILE_RECORD = 'CLEAR_FILE_RECORD';

export const FETCH_GET_FILE = 'FETCH_GET_FILE';
export const FETCH_GET_RECORDS = 'FETCH_GET_RECORDS';
export const FETCH_ADD_FILE = 'FETCH_ADD_FILE';
export const FETCH_UPDATE_FILE = 'FETCH_UPDATE_FILE';
export const FETCH_UPDATE_FILE_IMPORT = 'FETCH_UPDATE_FILE_IMPORT';
export const FETCH_UPDATE_FILE_ORDER = 'FETCH_UPDATE_FILE_ORDER';
export const FETCH_INIT_RECORDS = 'FETCH_INIT_RECORDS';
export const FETCH_ADD_TO_RECORDS = 'FETCH_ADD_TO_RECORDS';
export const FETCH_ADD_RECORDS = 'FETCH_ADD_RECORDS';
export const FETCH_UPDATE_RECORDS = 'FETCH_UPDATE_RECORDS';
export const FETCH_DELETE_RECORDS = 'FETCH_DELETE_RECORDS';
export const FETCH_ADD_RECORDS_ORDER_NUMBER = 'FETCH_ADD_RECORDS_ORDER_NUMBER';
export const FETCH_UPDATE_RECORDS_ORDER_NUMBER = 'FETCH_UPDATE_RECORDS_ORDER_NUMBER';
export const FETCH_CHANGE_RECORD_ORDER_NUMBER = 'FETCH_CHANGE_RECORD_ORDER_NUMBER';
export const FETCH_DELETE_RECORDS_ORDER_NUMBER = 'FETCH_DELETE_RECORDS_ORDER_NUMBER';
export const FETCH_GENERATE_FULL_BOX_LABELS = 'FETCH_GENERATE_FULL_BOX_LABELS';
export const FETCH_ADD_SHARE = 'FETCH_ADD_SHARE';
export const FETCH_DELETE_SHARE = 'FETCH_DELETE_SHARE';
export const FETCH_CLEAR_SHARE = 'FETCH_CLEAR_SHARE';

// 添加文件基础信息
export const setFile = file => ({ type: SET_FILE, payload: file })

// 添加记录集
export const setRecords = records => ({ type: SET_RECORDS, payload: records })

// 添加拼箱记录
export const setShare = share => ({ type: SET_SHARE, payload: share })

// 添加剩余商品数量
export const setSurplus = surplus => ({ type: SET_SURPLUS, payload: surplus })

// 动态添加一个空的元素
// 用来适配antd的动态Form（此处为被动实现，与业务无关）
export const addGoods = () => ({ type: ADD_FILE_GOODS })

// 添加一组goods
export const addToGoods = (goodsIdList) => ({ type: ADD_TO_FILE_GOODS, payload: {goodsIdList} })

// 设置某个位置的商品id（用于记录需填写的商品列表）
export const setGoods = ({index, goods_id}) => ({ type: SET_FILE_GOODS, payload: {index, goods_id} })

// 设置一些商品的exist状态（用于在填写记录时批量添加商品）
export const setAllGoodsExist = () => ({ type: SET_ALL_FILE_GOODS_EXIST })

// 删除某个位置的商品id（用于记录需填写的商品列表）
export const removeGoods = (index) => ({ type: REMOVE_FILE_GOODS, payload: {index} })

// 添加所有商品（用于记录需填写的商品列表）
export const setAllGoods = goods => ({ type: SET_FILE_ALL_GOODS, payload: goods })

// 添加所有仓库id（用于初始化数据）
export const setAllWarehouse = warehouse => ({ type: SET_FILE_ALL_WAREHOUSE, payload: warehouse })

// 向redux中修改文件
export const updateFile = file => ({ type: UPDATE_FILE, payload: file })

// 向redux中修改文件导入标识
export const updateFileImport = file => ({ type: UPDATE_FILE_IMPORT, payload: file })

// 向redux中添加记录集
export const addRecords = records => ({ type: ADD_RECORDS, payload: records })

// 向redux中修改记录集
export const updateRecords = records => ({ type: UPDATE_RECORDS, payload: records })

// 向redux中修改记录集箱贴
export const updateRecordsOrderNumber = file => ({ type: UPDATE_RECORDS_ORDER_NUMBER, payload: file })

// 从redux中清空文件相关属性
export const clearFileRecord = () => ({ type: CLEAR_FILE_RECORD })

// 从数据库中获取文件
export const fetchGetFile = () => ({ type: FETCH_GET_FILE })

// 从数据库中获取记录集
export const fetchGetRecords = (file) => ({ type: FETCH_GET_RECORDS, payload: file })

// 向数据库中添加文件
export const fetchAddFile = file => ({ type: FETCH_ADD_FILE, payload: file })

// 向数据库中修改文件
export const fetchUpdateFile = file => ({ type: FETCH_UPDATE_FILE, payload: file })

// 向数据库中修改文件导入状态
export const fetchUpdateFileImport = file => ({ type: FETCH_UPDATE_FILE_IMPORT, payload: file })

// 向数据库中修改文件订单录入状态
export const fetchUpdateFileOrder = file => ({ type: FETCH_UPDATE_FILE_ORDER, payload: file })

// 向数据库中初始化记录集（选定仓库及商品后的初始化操作）
export const fetchInitRecords = (file_id, {warehouseIdList, goodsIdList}) => ({ type: FETCH_INIT_RECORDS, payload: {file_id, warehouseIdList, goodsIdList}})

// 向数据库中追加记录集（输入记录时，追加商品）
export const fetchAddToRecords = (file_id, {warehouseIdList, goodsIdList}) => ({ type: FETCH_ADD_TO_RECORDS, payload: {file_id, warehouseIdList, goodsIdList}})

// 向数据库中添加记录集
export const fetchAddRecords = (file_id, records) => ({ type: FETCH_ADD_RECORDS, payload: {file_id, records} })

// 向数据库中修改记录集
export const fetchUpdateRecords = (file_id, records) => ({ type: FETCH_UPDATE_RECORDS, payload: {file_id, records} })

// 向数据库中删除记录集
export const fetchDeleteRecords = (file_id, records) => ({ type: FETCH_DELETE_RECORDS, payload: {file_id, records} })

// 向数据库中修改记录集箱贴
export const fetchAddRecordsOrderNumber = (file_id, {warehouse_id, goodsIdList, order_number}) => ({ type: FETCH_ADD_RECORDS_ORDER_NUMBER, payload: {file_id, warehouse_id, goodsIdList, order_number} })

// 向数据库中修改记录集箱贴
export const fetchUpdateRecordsOrderNumber = (file_id, {warehouse_id, goodsIdList, order_number, old_order_number}) => ({ type: FETCH_UPDATE_RECORDS_ORDER_NUMBER, payload: {file_id, warehouse_id, goodsIdList, order_number, old_order_number} })

// 向数据库中修改记录集箱贴
export const fetchChangeRecordOrderNumber = (file_id, {warehouse_id, goods_id, order_number}) => ({ type: FETCH_CHANGE_RECORD_ORDER_NUMBER, payload: {file_id, warehouse_id, goods_id, order_number} })

// 向数据库中删除记录集箱贴
export const fetchDeleteRecordsOrderNumber = (file_id, {warehouse_id, goodsIdList, order_number}) => ({ type: FETCH_DELETE_RECORDS_ORDER_NUMBER, payload: {file_id, warehouse_id, goodsIdList, order_number} })

// 生成整箱箱贴
export const fetchGenerateFullBoxLabels = (file) => ({ type: FETCH_GENERATE_FULL_BOX_LABELS, payload: file })

// 添加一个拼箱箱贴
export const fetchAddLabel = (file_id, {label, order_number, warehouse_id, goods}) => ({ type: FETCH_ADD_SHARE, payload: {file_id, label, order_number, warehouse_id, goods} })

// 删除一个拼箱箱贴
export const fetchDeleteLabel = (file_id, {label, warehouse_id,}) => ({ type: FETCH_DELETE_SHARE, payload: {file_id, label, warehouse_id,} })

// 清除拼箱箱贴
export const fetchClearLabel = (file_id) => ({ type: FETCH_CLEAR_SHARE, payload: {file_id} })
