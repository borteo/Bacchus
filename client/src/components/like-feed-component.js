import { h, Component } from 'preact';
import 'whatwg-fetch';

import LikeFeed from './like-feed';


export default class LikeFeedComponent extends Component {
  constructor() {
    super();
    this.state = { done: false }
  }

  likeFeed() {
    let that = this;

    this.setState({done: false});

    fetch('/api/like-feed')
      .then(function( resp ) {
      })
      .then(function( a ) {
        that.setState({done: true});
      })
    ;
  }

  render() {
    return <LikeFeed likeFeed={this.likeFeed.bind(this)} done={this.state.done}/>;
  }
}
