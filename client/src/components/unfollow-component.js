import { h, Component } from 'preact';
import 'whatwg-fetch';
import 'lodash';

import Unfollow from './unfollow';
import UnfollowTable from './unfollow-table';

let jerksLimit = 25;

export default class UnfollowComponent extends Component {
  constructor() {
    super();
    this.state = { 
      done: false,
      followings: [],
      followers: [],
      jerks: []
    };
  }

  componentDidMount() {
    this.getConnections();
  }

  saveConnections() {
    let that = this;
    fetch('/api/save-connections')
      .then(function(response) {})
      .then(function(json) {
        that.getConnections();
      }).catch(function(ex) {
        console.log('parsing failed', ex);
      })
    ;
  }

  getConnections() {
    let that = this;
    fetch('/api/connections')
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        that.setState({followings: json.followings});
        that.setState({followers: json.followers});

        let diff = _.differenceBy( that.state.followings, that.state.followers, 'id' );
        that.setState({jerks: diff});

      }).catch(function(ex) {
        console.log('parsing failed', ex);
      })
    ;
  }

  unfollowJerks() {
    let jerks = this.state.jerks.slice( 0, jerksLimit );
    const csrf = document.head.querySelector("[name=csrf-token]").content;

    fetch('/api/unfollow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf
      },
      body: JSON.stringify({
        _csrf: csrf,
        jerks: jerks
      })
    });
  }

  handleSelectChange( e ) {
    let options = e.target.options;
    jerksLimit = options[options.selectedIndex].value;
  }

  render() {
    return (
      <div>
      
        <Unfollow
          saveConnections={this.saveConnections.bind(this)}
          unfollowJerks={this.unfollowJerks.bind(this)}
          handleSelectChange={this.handleSelectChange.bind(this)}
        />
        <div class="row">
          <UnfollowTable header={"Followers"} data={this.state.followers} />
          <UnfollowTable header={"Followings"} data={this.state.followings} />
          <UnfollowTable header={"Jerks"} data={this.state.jerks} />
        </div>

      </div>
    );
  }
}
