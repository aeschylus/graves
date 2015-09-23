

import L from 'leaflet';
import React, { Component, PropTypes } from 'react';
import d3 from 'd3-browserify';


export default class extends Component {


  static contextTypes = {
    map: PropTypes.object.isRequired
  }


  static propTypes = {
    geojson: PropTypes.object.isRequired,
  }


  /**
   * Inject the d3 rig.
   */
  componentWillMount() {

    let map = this.context.map;

    // Inject the SVG containers.
    let pane = this.context.map.getPanes().overlayPane;
    this.svg = d3.select(pane).append('svg');
    this.g = this.svg.append('g').classed('leaflet-zoom-hide', true);

    let origin = map.getPixelOrigin();

    // Map lon/lat -> layer pixels.
    let transform = d3.geo.transform({
      point: function(x, y) {
        let point = map.project(new L.LatLng(x, y))._subtract(origin);
        this.stream.point(point.x, point.y);
      }
    });

    this.path = d3.geo.path().projection(transform);

    // Sync geometry when the map zooms.
    this.context.map.on(
      'viewreset',
      this.sync.bind(this, false)
    );

  }


  /**
   * Cache the GeoJSON bounds, initial sync.
   *
   * @param {Object} props
   */
  componentWillUpdate(props) {
    this.bounds = d3.geo.path().projection(null).bounds(props.geojson);
    this.sync(true);
  }


  /**
   * Sync the counties with the map.
   *
   * @param {Boolean} first
   */
  sync(first) {

    // Top right.
    let tl = this.context.map.latLngToLayerPoint([
      this.bounds[0][0],
      this.bounds[0][1],
    ]);

    // Bottom left.
    let br = this.context.map.latLngToLayerPoint([
      this.bounds[1][0],
      this.bounds[1][1],
    ]);

    // Position the container.
    this.svg
      .attr('width', br.x-tl.x)
      .attr('height', tl.y-br.y)
      .style('top', `${br.y}px`)
      .style('left', `${tl.x}px`);

    if (first) {

      // Set the initial <g> offset.
      this.g.attr('transform', `translate(${-tl.x},${-br.y})`);

      // Cache the starting corners.
      this.tl0 = tl;
      this.br0 = br;

    }

    else {

      let t = d3.transform(this.g.attr('transform'));

      // Scale to match zoom level.
      t.scale = [
        t.scale[0] * ((br.x - tl.x) / (this.br.x - this.tl.x)),
        t.scale[1] * ((tl.y - br.y) / (this.tl.y - this.br.y)),
      ];

      t.translate = [-this.tl0.x, -this.br0.y];

      let scale = `scale(${t.scale.join()})`;
      let translate = `translate(${t.translate.join()})`;
      this.g.attr('transform', scale+translate);

    }

    // Cache the current corners.
    this.tl = tl;
    this.br = br;

  }


  /**
   * Render d3-controlled paths.
   */
  render() {
    return null;
  }


}
