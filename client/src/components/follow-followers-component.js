import { h, Component } from 'preact';
import 'whatwg-fetch';
import 'lodash';

export default class UnfollowComponent extends Component {
  constructor() {
    super();
    this.state = {
      input: ""
    };
  }

  handleChange( e ) {
    this.setState({ input: e.target.value });
  }

  handleSubmit() {
    // remove white spaces
    let input = this.state.input.replace(/\s+/, "");
    console.log('me', input);

    let uri = [
      '/api/instagrammer/',
      input
    ].join('');

    fetch( uri )
      .then(function( response ) {
        return response.json();
      }).then(function( json ) {
        console.log('parsed json', json);
      }).catch(function( ex ) {
        console.log('parsing failed', ex);
      })
    ;
  }

  render() {
    return (
      <div>
        <h2>Follow Followers</h2>
        <div class="form-inline">
          <input
            class="form-control"
            onChange={ this.handleChange.bind(this) }
            placeholder="instagrammer"
          />
           <button
            class="btn btn-primary"
            onClick={ this.handleSubmit.bind(this) }
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}
