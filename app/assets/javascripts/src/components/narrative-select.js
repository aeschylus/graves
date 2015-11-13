

import React, { Component } from 'react';
import Select from 'react-select';


export default class extends Component {


  /**
   * Render the narrative select.
   */
  render() {

    let narratives = window.GRAVES.narratives.map(function(n) {

      let label = (
        <div className="narrative">
          <div className="title">{n.title}</div>
          <div className="author">{n.author}</div>
          <div className="blurb">{n.blurb}</div>
        </div>
      );

      return {
        value: n.slug,
        label: label,
      };

    });

    return <Select
      options={narratives}
      onChange={this.onChange.bind(this)}
    />;

  }


  /**
   * When the narrative is changed.
   *
   * @param {Object} option
   */
  onChange(option) {
    window.location.hash = `read/${option.value}`;
  }


}
