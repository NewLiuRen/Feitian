// @flow
import * as actionTypes from '../actions/fileRecord';
import { GOODS_TMP } from '../constants/goods';

const initState = {
  file: {},
  records: [],
  // 仓库缓存，用于读取历史文件用（因冻结仓库，历史文件中仓库状态可能同当前不一致）
  warehouse: [],
  // 当前所选的商品列表
  goods: [{...GOODS_TMP}],
}

// GOODS_TMP {id: null, exist: false}
const fileRecord = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_FILE:
      return Object.assign({}, state, {file: {...payload}});
    case actionTypes.SET_RECORDS:
      return Object.assign({}, state, {records: [...payload]});
    case actionTypes.ADD_FILE_GOODS:
      const newGoods = state.goods.concat(Object.assign({}, GOODS_TMP));
      return Object.assign({}, state, {goods: newGoods})
    case actionTypes.SET_FILE_GOODS:
      const { index: setIndex, goods_id } = payload;
      const setGoodsList = state.goods.slice();
      setGoodsList[setIndex].id = goods_id;
      return Object.assign({}, state, {goods: [...setGoodsList]});
    case actionTypes.SET_ALL_FILE_GOODS_EXIST:
      const setGoodsExistList = state.goods.slice();
      setGoodsExistList.forEach((g, i) => {
        setGoodsExistList[i].exist = true;
      })
      return Object.assign({}, state, {goods: [...setGoodsExistList]});
    case actionTypes.REMOVE_FILE_GOODS:
      const { index: removeIndex } = payload;
      const removeGoodsList = state.goods.slice();
      removeGoodsList.splice(removeIndex, 1);
      return Object.assign({}, state, {goods: [...removeGoodsList]});
    case actionTypes.SET_FILE_ALL_GOODS:
      return Object.assign({}, state, {goods: [...payload]});
    case actionTypes.SET_FILE_ALL_WAREHOUSE:
        return Object.assign({}, state, {warehouse: [...payload]});
    case actionTypes.CLEAR_FILE_RECORD:
      return Object.assign({}, initState);
    default:
      return state;
  }
}

export default fileRecord;
