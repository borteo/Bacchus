import { h, Component } from 'preact';

export default class Unfollow extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="form-inline">
        <button
          class="btn"
          onClick={ this.props.saveConnections }
        >
          Save My Connections
        </button>
        <button
          class="btn btn-primary"
          onClick={ this.props.unfollowJerks }
        >
          Unfollow jerks 💩
        </button>
        <select
          class="form-control"
          onChange={this.props.handleSelectChange}
        >
          <option>25</option>
          <option>50</option>
          <option>75</option>
          <option>150</option>
        </select>
      </div>
    );
  }
}