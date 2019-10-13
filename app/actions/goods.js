export const SET_GOODS_LIST = 'SET_GOODS_LIST';
export const SET_GOODS_WITH_DEL_LIST = 'SET_GOODS_WITH_DEL_LIST';
export const ADD_GOODS = 'ADD_GOODS';
export const UPDATE_GOODS = 'UPDATE_GOODS';
export const DELETE_GOODS = 'DELETE_GOODS';
export const CLEAR_GOODS_WITH_DEL_LIST = 'CLEAR_GOODS_WITH_DEL_LIST';

export const FETCH_GET_GOODS_LIST = 'FETCH_GET_GOODS_LIST';
export const FETCH_GET_GOODS_WITH_DEL_LIST = 'FETCH_GET_GOODS_WITH_DEL_LIST';
export const FETCH_ADD_GOODS = 'FETCH_ADD_GOODS';
export const FETCH_UPDATE_GOODS = 'FETCH_UPDATE_GOODS';
export const FETCH_FREEZE_GOODS = 'FETCH_FREEZE_GOODS';
export const FETCH_RECOVER_GOODS = 'FETCH_RECOVER_GOODS';

// 添加种类列表
export const setGoodsList = list => ({ type: SET_GOODS_LIST, payload: list })

// 添加种类列表(包含冻结)
export const setGoodsWithDelList = list => ({ type: SET_GOODS_WITH_DEL_LIST, payload: list })

// 向redux中添加种类
export const addGoods = goods => ({ type: ADD_GOODS, payload: goods })

// 向redux中修改种类
export const updateGoods = goods => ({ type: UPDATE_GOODS, payload: goods })

// 向redux中删除种类
export const deleteGoods = id => ({ type: DELETE_GOODS, payload: { id } })

export const clearGoodsWithDelList = () => ({ type: CLEAR_GOODS_WITH_DEL_LIST })

// 从数据库中获取列表
export const fetchGetGoodsList = () => ({ type: FETCH_GET_GOODS_LIST })

// 从数据库中获取列表（包含冻结）
export const fetchGetGoodsWithDelList = () => ({ type: FETCH_GET_GOODS_WITH_DEL_LIST })

// 向数据库中添加种类
export const fetchAddGoods = goods => ({ type: FETCH_ADD_GOODS, payload: goods })

// 向数据库中修改种类
export const fetchUpdateGoods = goods => ({ type: FETCH_UPDATE_GOODS, payload: goods })

// 向数据库中冻结种类
export const fetchFreezeGoods = (id) => ({ type: FETCH_FREEZE_GOODS, payload: { id } })

// 向数据库中恢复种类
export const fetchRecoverGoods = (id) => ({ type: FETCH_RECOVER_GOODS, payload: { id } })
