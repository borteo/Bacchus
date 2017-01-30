import { h, Component } from 'preact';

export default class Location extends Component {
  
  constructor(props) {
    super(props);

    this.state = { input: "" };
  }

  handleChange(e) {
    this.setState({ input: e.target.value });
  }

  handleLocation() {
    // remove white spaces
    let input = this.state.input.replace(/\s+/, "") 
    this.props.setLocation( input );
  }


  render() {
    return (
      <div class="form-inline">
        <input
          class="form-control"
          onChange={ this.handleChange.bind(this) }
          placeholder="city, country"
        />
        <button
          class="btn btn-primary"
          onClick={ this.handleLocation.bind(this) }
        >
          Find by Location
        </button>
      </div>
    );
  }
}