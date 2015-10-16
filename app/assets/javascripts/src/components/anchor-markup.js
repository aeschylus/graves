

import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { parseAttr, parseLonLat } from '../utils';
import * as actions from '../actions/counties';

import {
  showHighlightLine,
  hideHighlightLine,
} from '../events/narrative';

import {
  focusMap,
} from '../events/map';


@connect(null, actions)
export default class extends Component {


  static propTypes = {
    markup: PropTypes.object.isRequired,
  }


  /**
   * Wrap the markup container.
   */
  componentDidMount() {

    this.$el = $(this.props.markup);
    this.spans = this.$el.find('span.anchor');

    // Listen for cursor events.
    this.spans
      .on('mouseenter', this.onEnter.bind(this))
      .on('mouseleave', this.onLeave.bind(this))
      .on('click', this.onClick.bind(this));

  }


  /**
   * When the cursor enters an anchor.
   *
   * @param {Object} e
   */
  onEnter(e) {

    let span = $(e.target);
    let attrs = this.getAttrsFromEvent(e);

    // Show the highlight line.
    if (attrs.focus) {
      let [lon, lat] = attrs.focus;
      showHighlightLine(span, lon, lat);
    }

    span.addClass('highlight');

  }


  /**
   * When the cursor leaves an anchor.
   *
   * @param {Object} e
   */
  onLeave(e) {

    let span = $(e.target);

    hideHighlightLine();
    span.removeClass('highlight');

  }


  /**
   * When an anchor is clicked.
   *
   * @param {Object} e
   */
  onClick(e) {

    let attrs = this.getAttrsFromEvent(e);

    // Focus the map.
    if (attrs.focus) {
      let [lon, lat] = attrs.focus;
      focusMap(lon, lat, attrs.zoom);
    }

    // Update the choropleth.
    if (attrs.cdc) {
      this.props.showChoropleth(attrs.cdc);
    }

  }


  /**
   * Get data attributes from an event.
   *
   * @param {Object} e
   * @returns {Object}
   */
  getAttrsFromEvent(e) {

    let span = $(e.target);

    let zoom  = parseAttr(span, 'data-zoom', Number);
    let focus = parseAttr(span, 'data-focus', parseLonLat);
    let cdc   = parseAttr(span, 'data-cdc');

    return {
      focus, zoom, cdc
    };

  }


  render() {
    return null;
  }


}
