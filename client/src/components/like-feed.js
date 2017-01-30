import { h, Component } from 'preact';

export default class LikeFeed extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>Like Feed</h2>
        
        <div class="form-inline">
          <button
            class="btn btn-secondary"
            onClick={this.props.likeFeed}
          >
            Like My Feed { this.props.done ? "👍" : "⟳" }
          </button>
        </div>
        
      </div>
    );
  }
}