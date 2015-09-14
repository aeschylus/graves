

import _ from 'lodash';
import { combineReducers } from 'redux';
import * as constants from '../constants';


/**
 * CDC provinces.
 */
function provinces(state = {
  items: [],
  loading: false,
}, action) {

  switch (action.type) {

  case constants.REQUEST_PROVINCES:
    return _.assign({}, state, {
      loading: true,
    });

  case constants.RECEIVE_PROVINCES:
    return _.assign({}, state, {
      items: action.provinces,
      loading: false,
    });

  default:
    return state;

  }

}


export default combineReducers({
  provinces
});