

import fetch from 'isomorphic-fetch';

import {
  REQUEST_COUNTIES,
  RECEIVE_COUNTIES,
  RENDER_COUNTIES,
  HIGHLIGHT_COUNTY,
  UNHIGHLIGHT_COUNTY,
  RENDER_CHOROPLETH,
} from '../constants';


/**
 * Load CDC counties.
 */
export function loadCounties() {
  return dispatch => {

    // Notify start.
    dispatch(requestCounties());

    fetch('/api/counties')
    .then(res => res.json())
    .then(json => dispatch(receiveCounties(json)));

  };
}


/**
 * When CDC counties are requested.
 */
function requestCounties() {
  return {
    type: REQUEST_COUNTIES,
  };
}


/**
 * When CDC counties are loaded.
 *
 * @param {Object} json
 */
function receiveCounties(json) {
  return {
    type: RECEIVE_COUNTIES,
    geojson: json,
  };
}


/**
 * When counties are rendered.
 *
 * @param {Object} g
 */
export function renderCounties(g) {
  return {
    type: RENDER_COUNTIES,
    g: g,
  };
}


/**
 * Highlight an individual county.
 *
 * @param {Number} id
 */
export function highlightCounty(id) {
  return {
    type: HIGHLIGHT_COUNTY,
    id: id,
  };
}


/**
 * Unhighlight counties.
 */
export function unhighlightCounty() {
  return {
    type: UNHIGHLIGHT_COUNTY,
  };
}


/**
 * Render a demographic choropleth.
 *
 * @param {String} code
 */
export function renderChoropleth(code) {
  return {
    type: RENDER_CHOROPLETH,
    code: code,
  };
}
