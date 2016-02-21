

import _ from 'lodash';
import L from 'leaflet';
import classNames from 'classnames';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as utils from '../utils';

import Component from './component';


@connect(
  state => ({
    sections: state.sections.attrs
  })
)
export default class extends Component {


  static propTypes = {
    map: PropTypes.object.isRequired,
  };


  /**
   * Initialize the feature groups.
   */
  componentWillMount() {

    this.idToLabel = {};
    this.idToBox = {};

    // Label group.
    this.labels = L.featureGroup();
    this.labels.addTo(this.props.map);

    // Box group.
    this.boxes = L.featureGroup();
    this.boxes.addTo(this.props.map);

  }


  render() {

    if (this.props.sections) {

      // Clear existing markers.
      this.boxes.clearLayers();

      _.each(this.props.sections, s => {

        let { id, tl, br, label } = s;

        // ** Label

        let icon = L.divIcon({
          html: label,
          iconSize: null,
        });

        let marker = L.marker([br[1], tl[0]], { icon, id });

        // Add the label.
        this.labels.addLayer(marker);
        this.idToLabel[id] = marker;

        // ** Box

        let points = [
          utils.swap(tl),
          utils.swap([br[0], tl[1]]),
          utils.swap(br),
          utils.swap([tl[0], br[1]]),
        ];

        let box = L.polygon(points, {
          pointerEvents: 'none',
          className: 'section box',
        });

        // Add the box.
        this.boxes.addLayer(box);
        this.idToBox[id] = box;

      });

    }

    return null;

  }


}
