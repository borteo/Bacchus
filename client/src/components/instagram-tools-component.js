import { h, Component } from 'preact';
import 'whatwg-fetch';

export default class InstagramToolsComponent extends Component {
  constructor() {
    super();
  }

  handleClick() {
    let that = this;

    fetch('/api/login-instagram')
      .then(function( response ) {
        return response.json();
      }).then(function(json) {
        console.log('merda', json);
      }).catch(function(ex) {
        console.log('parsing failed', ex);
      })
    ;
  }

  render() {
    return (
      <div>
         <button
          class="btn btn-primary"
          onClick={ this.handleClick.bind(this) }
        >
          Login to Instagram
        </button>
      </div>      
    );
  }
}
