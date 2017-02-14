import { h, Component } from 'preact';
import 'whatwg-fetch';

export default class InstagramUsersComponent extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      usersFiltered: [],
      usersPage: [],
      page: 0,
      pages: 0,
      rows: 100,
      isHidePrivate: false,
      isHideBadFollowers: false
    };
  }

  componentDidMount() {
    let that = this;

    fetch('/api/instagram-users')
      .then(function( response ) {
        return response.json();
      }).then(function(json) {
        that.setState({
          users: json,
          usersFiltered: json
        });
        that.setPagination();
      }).catch(function(ex) {
        console.log('parsing failed', ex);
      })
    ;
  }

  setPagination() {
    let currentPage = this.state.page * this.state.rows;
    let nextPage = ( this.state.page + 1 ) * this.state.rows;
    let page = this.state.usersFiltered.slice( currentPage, nextPage );
    let pages = Math.floor( this.state.users.length / this.state.rows );

    this.setState({
      usersPage: page,
      pages: pages
    });
  }

  filterUsers( prop ) {
    let users;
    let filters = {};

    if ( this.state.isHideBadFollowers ) {
      filters = {
        isGoodCandidate: this.state.isHideBadFollowers
      };
    }
    if ( this.state.isHidePrivate ) {
      filters = {
        isPrivate: !this.state.isHidePrivate
      };
    }
    if ( this.state.isHideBadFollowers && this.state.isHidePrivate) {
        filters = {
        isGoodCandidate: this.state.isHideBadFollowers,
        isPrivate: !this.state.isHidePrivate
      };
    }

    if ( _.isEmpty(filters)) {
      users = this.state.users;
    } else {
      users = _.filter(this.state.users, filters);    
    }

    this.setState({
      usersFiltered: users
    });
  }

  handlePrevPage() {
    if ( this.state.page === 0 ) return;
    this.setState({page: this.state.page - 1});
    this.setPagination();
  }

  handleNextPage(){
    this.setState({page: this.state.page + 1});
    this.setPagination();
  }

  handleHidePrivateClick() {
    this.setState({isHidePrivate: !this.state.isHidePrivate});
    this.filterUsers();
    this.setPagination(); 
  }

  handleHideBadFollowersClick() {
    this.setState({isHideBadFollowers: !this.state.isHideBadFollowers});
    this.filterUsers();
    this.setPagination(); 
  }


  render() {
    return (
      <div>
      
        <div class="form-inline" style="float: right;">
          <div class="checkbox">
            <label>
              <input
                type="checkbox"
                name="hide-private"
                checked={this.state.isHidePrivate}
                onClick={this.handleHidePrivateClick.bind(this)}
              />
              Hide Private
            </label>
            <label>
              <input
                type="checkbox"
                name="hide-private"
                checked={this.state.isHideBadFollowers}
                onClick={this.handleHideBadFollowersClick.bind(this)}
              />
              Hide Bad Followers
            </label>
          </div>

          <div class="form-group">
            <button
              class="btn"
              onClick={ this.handlePrevPage.bind(this) }
            >
             <i class="fa fa-arrow-left" aria-hidden="true"></i>
            </button>
             <button
              class="btn"
              onClick={ this.handleNextPage.bind(this) }
            >
              <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        
        <h3>Users ({this.state.usersFiltered.length}/{this.state.users.length}) - Page ({this.state.page}/{this.state.pages})</h3>

        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Follows</th>
              <th>Private</th>
              <th>Good</th>
              <th>Updated</th>
              <th>Liked</th>
              <th>Followed</th>
            </tr>
          </thead>
          <tbody>
            {this.state.usersPage.map((user, index ) => {
              return (
                <tr key={index} class={user.isPrivate ? "danger" : ""}>
                  <th scope="row">{index + 1}</th>
                  <td title={user.name}>{user.username}</td>
                  <td>{user.followers}/{user.followings}</td>
                  <td><i class={ user.isPrivate === true ? "red fa fa-lock" : "green fa fa-unlock"}></i></td>
                  <td><i class={ user.isGoodCandidate === true ? "green fa fa-thumbs-o-up" : "red fa fa-thumbs-o-down"}></i></td>
                  <td><i class={ user.isUpdated === true ? "green fa fa-check-circle-o" : "orange fa fa-question-circle-o"}></i></td>
                  <td><i class={ user.isLiked === true ? "green fa fa-thumbs-o-up" : "orange fa fa-ellipsis-h"}></i></td>
                  <td><i class={ user.isFollowed === true ? "green fa fa-heart-o" : "orange fa fa-ellipsis-h"}></i></td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          class="btn"
          onClick={ this.handlePrevPage.bind(this) }
        >
         <i class="fa fa-arrow-left" aria-hidden="true"></i>
        </button>
         <button
          class="btn"
          onClick={ this.handleNextPage.bind(this) }
        >
          <i class="fa fa-arrow-right" aria-hidden="true"></i>
        </button>
        
      </div>
      
    );
  }
}
