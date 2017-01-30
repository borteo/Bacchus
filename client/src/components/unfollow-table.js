// unfollow-table.js

import { h, Component } from 'preact';

export default class UnfollowTable extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="col-md-4">
        <h2>{this.props.header} ({this.props.data.length})</h2>
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>username</th>
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((user, index ) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td title={user.name}>{user.username}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}






        