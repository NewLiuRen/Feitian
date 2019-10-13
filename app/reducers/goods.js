// @flow
import * as actionTypes from '../actions/goods';

const initState = {
  list: [],
  listWithDel: [],
}

const goods = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_GOODS_LIST:
      return Object.assign({}, state, {list: [...payload]});
    case actionTypes.SET_GOODS_WITH_DEL_LIST:
      return Object.assign({}, state, {listWithDel: [...payload]});
    case actionTypes.ADD_GOODS:
      const addList = state.list.concat(payload)
      return Object.assign({}, state, {list: addList});
    case actionTypes.UPDATE_GOODS:
      const uIndex = state.list.findIndex(w => w.id === payload.id);
      return Object.assign({}, state, {list: [
        ...state.list.slice(0, uIndex),
        payload,
        ...state.list.slice(uIndex + 1),
      ]});
    case actionTypes.DELETE_GOODS:
      const dIndex = state.list.findIndex(w => w.id === payload.id);
      return Object.assign({}, state, {list: [
        ...state.list.slice(0, dIndex), ...state.list.slice(dIndex + 1)
      ]});
    case actionTypes.CLEAR_GOODS_WITH_DEL_LIST:
      return Object.assign({}, state, {listWithDel: []})
    default:
      return state;
  }
}

export default goods;
