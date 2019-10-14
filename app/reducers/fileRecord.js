// @flow
import * as actionTypes from '../actions/fileRecord';

const initState = {
  file: {},
  records: [],
}

const fileRecord = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_FILE:
      return Object.assign({}, state, {file: {...payload}});
    case actionTypes.SET_RECORDS:
      return Object.assign({}, state, {records: [...payload]});
    case actionTypes.CLEAR_FILE_RECORD:
      return Object.assign({}, initState);
    default:
      return state;
  }
}

export default fileRecord;
