

import _ from 'lodash';


/**
 * Map action types to handlers.
 *
 * @param {Object} initialState
 * @param {Object} handlers
 */
export function createReducer(initialState, handlers) {
  return (state = initialState, action) => {

    // If a handler is provided for the current action, apply the reducer
    // and merge the result with the initial state.

    if (_.has(handlers, action.type)) {
      return {
        ...state,
        ...handlers[action.type](state, action),
      };
    }

    // Otherwise, return the intial state.

    else {
      return state;
    }

  };
}


/**
 * Parse a lon/lat string into an array.
 *
 * @param {Object} lonlat - "108.040,36.774"
 * @return {Array<Number>}
 */
export function parseLonLat(lonlat='') {
  return lonlat.split(',').map(Number);
}


/**
 * Swap lon/lat -> lat/lon, vice versa.
 *
 * @param {Array<Number>} coord
 * @return {Array<Number>}
 */
export function swap(coord) {
  return [coord[1], coord[0]];
}


/**
 * Extract an individual data attribute from an element.
 *
 * @param {Object} $el
 * @param {String} attr
 * @param {Function} parse
 * @return {Mixed}
 */
export function parseAttr($el, attr, parse) {

  var value = $el.attr(attr);

  return (value && _.isFunction(parse)) ?
    parse(value) : undefined;

}
