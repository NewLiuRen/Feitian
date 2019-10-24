// @flow
import * as actionTypes from '../actions/fileRecord';

const initState = {
  file: {},
  records: [],
  goods: [],
}

const fileRecord = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_FILE:
      return Object.assign({}, state, {file: {...payload}});
    case actionTypes.SET_RECORDS:
      return Object.assign({}, state, {records: [...payload]});
    case actionTypes.ADD_FILE_GOODS:
      console.log('enter');
      console.log('object :', state.goods);
      const newGoods = state.goods.concat(undefined);
      console.log('newGoods :', newGoods);
      return Object.assign({}, state, {goods: newGoods})
    case actionTypes.SET_FILE_GOODS:
      console.log('fileRecord :', payload);
      return Object.assign({}, state, {goods: [...payload]});
    case actionTypes.CLEAR_FILE_RECORD:
      return Object.assign({}, initState);
    default:
      return state;
  }
}

export default fileRecord;
