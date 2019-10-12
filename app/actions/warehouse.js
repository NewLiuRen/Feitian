export const SET_WAREHOUSE_LIST = 'SET_WAREHOUSE_LIST';
export const SET_WAREHOUSE_WITH_DEL_LIST = 'SET_WAREHOUSE_WITH_DEL_LIST';
export const ADD_WAREHOUSE = 'ADD_WAREHOUSE';
export const UPDATE_WAREHOUSE = 'UPDATE_WAREHOUSE';
export const DELETE_WAREHOUSE = 'DELETE_WAREHOUSE';
export const CLEAR_WAREHOUSE_WITH_DEL_LIST = 'CLEAR_WAREHOUSE_WITH_DEL_LIST';

export const FETCH_GET_WAREHOUSE_LIST = 'FETCH_GET_WAREHOUSE_LIST';
export const FETCH_GET_WAREHOUSE_WITH_DEL_LIST = 'FETCH_GET_WAREHOUSE_WITH_DEL_LIST';
export const FETCH_ADD_WAREHOUSE = 'FETCH_ADD_WAREHOUSE';
export const FETCH_UPDATE_WAREHOUSE = 'FETCH_UPDATE_WAREHOUSE';
export const FETCH_FREEZE_WAREHOUSE = 'FETCH_FREEZE_WAREHOUSE';
export const FETCH_RECOVER_WAREHOUSE = 'FETCH_RECOVER_WAREHOUSE';

// 添加仓库列表
export const setWarehouseList = list => ({ type: SET_WAREHOUSE_LIST, payload: list })

// 添加仓库列表(包含冻结)
export const setWarehouseWithDelList = list => ({ type: SET_WAREHOUSE_WITH_DEL_LIST, payload: list })

// 向redux中添加仓库
export const addWarehouse = warehouse => ({ type: ADD_WAREHOUSE, payload: warehouse })

// 向redux中修改仓库
export const updateWarehouse = warehouse => ({ type: UPDATE_WAREHOUSE, payload: warehouse })

// 向redux中删除仓库
export const deleteWarehouse = id => ({ type: DELETE_WAREHOUSE, payload: { id } })

export const clearWarehouseWithDelList = () => ({ type: CLEAR_WAREHOUSE_WITH_DEL_LIST })

// 从数据库中获取列表
export const fetchGetWarehouseList = () => ({ type: FETCH_GET_WAREHOUSE_LIST })

// 从数据库中获取列表（包含冻结）
export const fetchGetWarehouseWithDelList = () => ({ type: FETCH_GET_WAREHOUSE_WITH_DEL_LIST })

// 向数据库中添加仓库
export const fetchAddWarehouse = warehouse => ({ type: FETCH_ADD_WAREHOUSE, payload: warehouse })

// 向数据库中修改仓库
export const fetchUpdateWarehouse = warehouse => ({ type: FETCH_UPDATE_WAREHOUSE, payload: warehouse })

// 向数据库中冻结仓库
export const fetchFreezeWarehouse = (id) => ({ type: FETCH_FREEZE_WAREHOUSE, payload: { id } })

// 向数据库中恢复仓库
export const fetchRecoverWarehouse = (id) => ({ type: FETCH_RECOVER_WAREHOUSE, payload: { id } })
