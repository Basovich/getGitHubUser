// assets
import './assets/polyffils/polyfills-closest';
import './assets/polyffils/polyfills-customevent';
import './assets/libs/animation_stopper.min.js';
import './assets/libs/scroll_locker';
import 'core-js/stable/dom-collections/for-each';

// main function
import {GetGitHubUsers} from './components/github-user/GetGitHubUsers';


// Init Functions
window.addEventListener('load', onLoadMain);

function onLoadMain() {
	const gitHubUsers = new GetGitHubUsers;
}
