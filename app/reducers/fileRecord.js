// @flow
import * as actionTypes from '../actions/fileRecord';

const initState = {
  file: {},
  records: [],
  // 仓库缓存，用于读取历史文件用（因冻结仓库，历史文件中仓库状态可能同当前不一致）
  warehouse: [],
  goods: [null],
}

const fileRecord = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_FILE:
      return Object.assign({}, state, {file: {...payload}});
    case actionTypes.SET_RECORDS:
      return Object.assign({}, state, {records: [...payload]});
    case actionTypes.ADD_FILE_GOODS:
      const newGoods = state.goods.concat(null);
      return Object.assign({}, state, {goods: newGoods})
    case actionTypes.SET_FILE_GOODS:
      const { index: setIndex, goods_id } = payload;
      const setGoodsList = state.goods.slice();
      setGoodsList[setIndex] = goods_id;
      return Object.assign({}, state, {goods: [...setGoodsList]});
    case actionTypes.REMOVE_FILE_GOODS:
      const { index: removeIndex } = payload;
      const removeGoodsList = state.goods.slice();
      removeGoodsList.splice(removeIndex, 1);
      return Object.assign({}, state, {goods: [...removeGoodsList]});
    case actionTypes.SET_FILE_ALL_GOODS:
      return Object.assign({}, state, {goods: [...payload]});
    case actionTypes.CLEAR_FILE_RECORD:
      return Object.assign({}, initState);
    default:
      return state;
  }
}

export default fileRecord;
