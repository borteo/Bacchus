import { h, render } from 'preact';
import App from './components/app';
import LocationComponent from './components/location-component';
import LikeFeedComponent from './components/like-feed-component';
import UnfollowComponent from './components/unfollow-component';
import InstagramUsersComponent from './components/instagram-users-component';
import FollowFollowersComponent from './components/follow-followers-component';
import BotComponent from './components/bot-component';
import InstagramToolsComponent from './components/instagram-tools-component';


render(<App />, document.querySelector('.app'));

render(<LocationComponent />, document.querySelector('.location-component'));
render(<LikeFeedComponent />, document.querySelector('.like-feed-component'));
render(<InstagramUsersComponent />, document.querySelector('.instagram-users-component'));
render(<FollowFollowersComponent />, document.querySelector('.follow-followers-component'));
render(<BotComponent />, document.querySelector('.bot-component'));
render(<UnfollowComponent />, document.querySelector('.unfollow-component'));

render(<InstagramToolsComponent />, document.querySelector('.instagram-tools-component'));
