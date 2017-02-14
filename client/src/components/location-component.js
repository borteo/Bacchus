import { h, Component } from 'preact';
import 'whatwg-fetch';

import Location from './location';
import Tools from './tools';

export default class LocationComponent extends Component {
  constructor() {
    super();
    this.state = { 
      done: false
    };
  }

  setLocation( inputData ) {
    let that = this;
    this.setState( {done: false} );

    let uri = [
      '/api/location/',
      inputData
    ].join('');

    fetch( uri )
      .then(function( resp ) {
      })
      .then(function( a ) {
        that.setState({done: true});
      })
    ;
  }

  checkUsers() {
    let that = this;
    fetch('/api/check-users')
      .then(function( response ) {
        return response.json();
      }).then(function(json) {
        console.log('parsed json', json);
      }).catch(function(ex) {
        console.log('parsing failed', ex);
      })
    ;
  }

  autolike() {
    let that = this;
    fetch('/api/autolike')
      .then(function( response ) {
         console.log('response', response);
      })
      .catch(function(ex) {
        console.log('parsing failed', ex);
      })
    ;
  }

  deleteAll() {
    let that = this;
    fetch('/api/delete-all')
      .then(function( response ) {
        // reload page
        window.location.reload();
      })
      .catch(function(ex) {
        console.log('parsing failed', ex);
      })
    ;
  }

  render() {
    return (
      <div>
        <h2>Locations</h2>

        <Location
          setLocation={this.setLocation.bind(this)} 
          done={this.state.done}
        />

        <hr/>

        <Tools
          checkUsers={this.checkUsers.bind(this)}
          autolike={this.autolike.bind(this)}
          deleteAll={this.deleteAll.bind(this)}
        />
      </div>
    );
  }
}
