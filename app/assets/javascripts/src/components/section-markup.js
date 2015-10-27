

import _ from 'lodash';
import $ from 'jquery';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Waypoints from 'waypoints';
import imagesLoaded from 'imagesloaded';

import Component from './component';
import { parseAttrs, parseLonLat } from '../utils';
import * as actions from '../actions/sections';
import tipTpl from './tip.jade';

import {
  SECTIONS,
  MAP,
  SELECT_SECTION
} from '../constants';

import {
  scrollSection,
  selectSection,
} from '../events/sections';

import {
  isSectionFocused
} from '../events/map';


@connect(null, actions)
export default class extends Component {


  static events = {
    [SECTIONS]: {
      [SELECT_SECTION]: 'select'
    }
  }


  static propTypes = {
    markup: PropTypes.object.isRequired,
  }


  /**
   * Wrap the container, extract sections.
   */
  componentDidMount() {

    this.$el = $(this.props.markup);
    this.sections = this.$el.find('.section');

    this.generateDataIds();
    this.publishData();
    this.bindCursorEvents();
    this.monitorScroll();
    this.bindResizeEvent();

  }


  /**
   * Unmount the section layers.
   */
  componentWillUnmount() {
    this.props.unmountSections();
  }


  /**
   * Write `data-id` attributes.
   */
  generateDataIds() {
    this.sections.each((i, s) => {
      $(s).attr('data-id', i);
    });
  }


  /**
   * Mount data attributes to the store.
   */
  publishData() {

    let data = [];

    this.sections.each((i, s) => {

      let attrs = parseAttrs($(s), {
        id:     ['data-id', Number],
        tl:     ['data-tl', parseLonLat],
        br:     ['data-br', parseLonLat],
        label:  'data-label',
      });

      // Don't publish invalid sections.
      if (!_.contains(attrs, undefined)) {
        data.push(attrs);
      }

    });

    this.props.mountSections(data);

  }


  /**
   * Listen for section enter/leave.
   */
  bindCursorEvents() {

    this.sections
      .on('mouseenter', this.onEnter.bind(this))
      .on('mouseleave', this.onLeave.bind(this));

  }


  /**
   * Monitor the visible section.
   */
  monitorScroll() {

    this.sections.each((i, s) => {
      new Waypoint({

        element: s,
        offset: 100,

        handler: dir => {

          let section = (dir == 'down') ?
            $(s) : $(s).prev('.section');

          let attrs = parseAttrs(section, {
            id: ['data-id', Number]
          });

          scrollSection(attrs.id);

        }

      });
    });

    // Update waypoint offsets.
    imagesLoaded(this.props.markup, () => {
      Waypoint.refreshAll();
    });

  }


  /**
   * On resize, cache container position.
   */
  bindResizeEvent() {

    this.cachePosition();

    // Re-cache on resize.
    let resize = _.debounce(this.cachePosition.bind(this), 500);
    $(window).resize(resize);

  }


  /**
   * Cache container boundaries.
   */
  cachePosition() {

    let content = this.$el.closest('.content');

    this.width  = content.outerWidth();
    this.offset = content.offset();
    this.right  = this.offset.left + this.width;

  }


  // ** Publishers:


  /**
   * When the cursor enters a section.
   *
   * @param {Object} e
   */
  onEnter(e) {

    let attrs = parseAttrs($(e.currentTarget), {
      id: ['data-id', Number]
    });

    // Is the section focused?
    let focused = isSectionFocused(attrs.id);

    // If not, click to select.
    if (!focused) {
      this.enableSelect(attrs.id);
    }

  }


  /**
   * When the cursor leaves a section.
   *
   * @param {Object} e
   */
  onLeave(e) {

    let attrs = parseAttrs($(e.currentTarget), {
      id: ['data-id', Number]
    });

    this.disableSelect(attrs.id);

  }


  // ** Renderers:


  /**
   * Scroll a section into view.
   *
   * @param {Number} id
   * @param {String} origin
   */
  select(id, origin) {

    let section = this.getSectionById(id);

    // Scroll into view.
    $('body').animate({
      scrollTop: section[0].offsetTop - 50
    }, {
      duration: 700
    });

  }


  /**
   * Select a section on click.
   *
   * @param {Number} id
   */
  enableSelect(id) {

    let section = this.getSectionById(id);
    section.addClass('selectable');

    // Inject the tooltip.
    this.tip = $(tipTpl()).appendTo('body');

    // Sync tooltip Y with cursor.
    section.mousemove(e => {
      this.tip.css({ top: e.clientY, left: this.right+10 });
    });

    // Click to select.
    section.click(e => {
      selectSection(id);
      this.disableSelect(id);
    });

  }


  /**
   * Remove the select listener.
   *
   * @param {Number} id
   */
  disableSelect(id) {

    // Clear event listeners.
    let section = this.getSectionById(id);
    section.off('click mousemove');
    section.removeClass('selectable');

    // Clear tip.
    this.tip.remove();

  }


  // ** Helpers:


  /**
   * Get a section by `data-id`.
   *
   * @param {Number} id
   */
  getSectionById(id) {
    return this.sections.filter(`[data-id="${id}"]`);
  }


}
