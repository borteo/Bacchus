import { h, Component } from 'preact';

export default class Tools extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {

/*
    <!button
          class="btn btn-primary"
          onClick={ this.props.autofollow }
        >
          Autofollow
        </button>
*/

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
      </div>
      
    );
  }
}
