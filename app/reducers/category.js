// @flow
import * as actionTypes from '../actions/category';
import { generateMap } from '../utils';

const initState = {
  list: [],
  listWithDel: [],
  map: {},
}

const category = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_CATEGORY_LIST:
      return Object.assign({}, state, {list: [...payload]});
    case actionTypes.SET_CATEGORY_WITH_DEL_LIST:
      return Object.assign({}, state, {listWithDel: [...payload]});
    case actionTypes.SET_CATEGORY_MAP:
      return Object.assign({}, state, {map: generateMap([...payload])})
    case actionTypes.ADD_CATEGORY:
      const addList = state.list.concat(payload)
      return Object.assign({}, state, {list: addList});
    case actionTypes.UPDATE_CATEGORY:
      const uIndex = state.list.findIndex(w => w.id === payload.id);
      return Object.assign({}, state, {list: [
        ...state.list.slice(0, uIndex),
        payload,
        ...state.list.slice(uIndex + 1),
      ]});
    case actionTypes.DELETE_CATEGORY:
      const dIndex = state.list.findIndex(w => w.id === payload.id);
      return Object.assign({}, state, {list: [
        ...state.list.slice(0, dIndex), ...state.list.slice(dIndex + 1)
      ]});
    case actionTypes.CLEAR_CATEGORY_WITH_DEL_LIST:
      return Object.assign({}, state, {listWithDel: []})
    default:
      return state;
  }
}

export default category;
