

import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Router } from 'director';

import * as actions from '../actions/route';
import Component from './component';
import Content from './content';
import Narrative from './narrative';
import Map from './map';


@connect(
  state => state.route,
  actions
)
export default class extends Component {


  static propTypes = {
    explore: PropTypes.bool.isRequired,
    narrative: PropTypes.any,
  }


  /**
   * Listen for routes.
   */
  componentDidMount() {

    this.router = Router({

      '/': () => {
        this.props.showSplash();
      },

      '/read/:slug': slug => {
        this.props.showNarrative(slug);
      },

      '/explore': () => {
        this.props.showExplore();
      },

    });

    this.router.init();
    window.ROUTER = this.router;

  }


  /**
   * Tear down router.
   */
  componentWillUnmount() {
    this.router.setRoute();
    this.router.destroy();
  }


  /**
   * Render the top-level application structure.
   */
  render() {

    let content = null;

    // Render a narrative, when one is active.
    if (this.props.narrative) {
      content = (
        <Content>
          <Narrative slug={this.props.narrative} />
        </Content>
      );
    }

    return (
      <div className="wrapper">
        <Map />
        {content}
      </div>
    );

  }


}
