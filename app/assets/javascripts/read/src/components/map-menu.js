

import React from 'react';

import Component from './component';
import BaseLayerSelect from './base-layer-select';
import WmsLayerSelect from './wms-layer-select';
import ChoroplethSelect from './choropleth-select';


export default class extends Component {


  /**
   * Render the map burger menu.
   */
  render() {
    return (
      <div id="map-menu">
        <BaseLayerSelect />
        <ChoroplethSelect />
        <WmsLayerSelect />
      </div>
    );
  }


}
