

import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import * as actions from '../actions/map';

import Component from './component';
import codes from '../data/cdc-codes.yml';


@connect(
  state => ({
    code: state.map.choropleth
  }),
  actions,
)
export default class extends Component {


  static propTypes = {
    choropleth: PropTypes.string,
    changeChoropleth: PropTypes.func.isRequired,
  };


  /**
   * Render the choropleth select.
   */
  render() {

    let options = _.map(codes.counties, function(label, code) {
      return {
        value: code,
        label,
      };
    });

    return (
      <Select

        className="choropleth-select"

        placeholder="Select a demographic variable"
        options={options}

        onChange={this.onChange.bind(this)}
        value={this.props.code}

      />
    );

  }


  /**
   * When the choropleth is changed.
   *
   * @param {Object} option
   */
  onChange(option) {
    let id = option ? option.value : null;
    this.props.changeChoropleth(id);
  }


}
