import { h, Component } from 'preact';

export default class Tools extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="form-inline">
        <button
          class="btn btn-primary"
          onClick={ this.props.checkUsers }
        >
          Check Users
        </button>

        <button
          class="btn btn-primary"
          onClick={ this.props.autolike }
        >
          Autolike
        </button>

        <button
          class="btn btn-secondary"
          onClick={ this.props.deleteAll }
        >
          Delete All
        </button>
      </div>
      
    );
  }
}
