import { h, Component } from 'preact';
import 'whatwg-fetch';

import LikeFeed from './like-feed';


export default class botComponent extends Component {
  constructor() {
    super();
  }

  startBot() {
    let that = this;

    fetch('start-bot')
      .then(function( resp ) {
      })
      .then(function( a ) {
      })
    ;
  }

  render() {
    return (
      <button 
        class="btn btn-primary"
        onClick={this.startBot.bind(this)}
      >
        Start Bot
      </button>
    )
  }
}
