import { h, Component } from 'preact';

import 'whatwg-fetch';


export default class App extends Component {
  constructor() {
    super();
    this.state = { user: {} };
  }

  componentDidMount() {
    let that = this;

    fetch('/api/current-user')
      .then(function(response) {
        return response.json()
      }).then(function(json) {
        console.log('parsed json', json);
         that.setState({user: json});
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })
    ;
  }

  render() {
    return (
      <div>
        <h3>Current user: {this.state.user.username}</h3>
      </div>
    );
  }
}