export const SET_CATEGORY_LIST = 'SET_CATEGORY_LIST';
export const SET_CATEGORY_WITH_DEL_LIST = 'SET_CATEGORY_WITH_DEL_LIST';
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const CLEAR_CATEGORY_WITH_DEL_LIST = 'CLEAR_CATEGORY_WITH_DEL_LIST';

export const FETCH_GET_CATEGORY_LIST = 'FETCH_GET_CATEGORY_LIST';
export const FETCH_GET_CATEGORY_WITH_DEL_LIST = 'FETCH_GET_CATEGORY_WITH_DEL_LIST';
export const FETCH_ADD_CATEGORY = 'FETCH_ADD_CATEGORY';
export const FETCH_UPDATE_CATEGORY = 'FETCH_UPDATE_CATEGORY';
export const FETCH_FREEZE_CATEGORY = 'FETCH_FREEZE_CATEGORY';
export const FETCH_RECOVER_CATEGORY = 'FETCH_RECOVER_CATEGORY';

// 添加种类列表
export const setCategoryList = list => ({ type: SET_CATEGORY_LIST, payload: list })

// 添加种类列表(包含冻结)
export const setCategoryWithDelList = list => ({ type: SET_CATEGORY_WITH_DEL_LIST, payload: list })

// 向redux中添加种类
export const addCategory = category => ({ type: ADD_CATEGORY, payload: category })

// 向redux中修改种类
export const updateCategory = category => ({ type: UPDATE_CATEGORY, payload: category })

// 向redux中删除种类
export const deleteCategory = id => ({ type: DELETE_CATEGORY, payload: { id } })

export const clearCategoryWithDelList = () => ({ type: CLEAR_CATEGORY_WITH_DEL_LIST })

// 从数据库中获取列表
export const fetchGetCategoryList = () => ({ type: FETCH_GET_CATEGORY_LIST })

// 从数据库中获取列表（包含冻结）
export const fetchGetCategoryWithDelList = () => ({ type: FETCH_GET_CATEGORY_WITH_DEL_LIST })

// 向数据库中添加种类
export const fetchAddCategory = category => ({ type: FETCH_ADD_CATEGORY, payload: category })

// 向数据库中修改种类
export const fetchUpdateCategory = category => ({ type: FETCH_UPDATE_CATEGORY, payload: category })

// 向数据库中冻结种类
export const fetchFreezeCategory = (id) => ({ type: FETCH_FREEZE_CATEGORY, payload: { id } })

// 向数据库中恢复种类
export const fetchRecoverCategory = (id) => ({ type: FETCH_RECOVER_CATEGORY, payload: { id } })
