import {getTarget} from "../../helper-function/get-target";

class GetGitHubUsers {
	constructor() {
		this.isEmpty = true;
		this.userData = '';
		this.userRepoList = '';
		this.userName = '';
		this.url = `https://api.github.com/users/`;
		this.button = document.querySelector('[data-button-add]');
		this.input = document.querySelector('[data-input-user-name]');
		this.errorMessage = document.querySelector('[data-error-message]');
		this.usersContainer = document.querySelector('[data-wrapper-users]');
		this.isNoUserBlock = document.querySelector('[data-is-no-user]');

		this.listeners();
	}

	listeners() {
		this.listenerAddUser();
		this.listenerFocusInput();
		this.listenerDeleteCardsListener();
	}

	listenerAddUser() {
		this.button.addEventListener('click', () => {
			const val = this.input.value.trim();
			if (!val) {
				this.validate('Enter username');
				return false;
			}

			this.userName = val;
			this.input.value = '';
			this.onSearchUser();
		});
	}

	listenerFocusInput() {
		this.input.addEventListener('focus', event => {
			event.currentTarget.classList.remove('error');
		})
	}

	listenerDeleteCardsListener() {
		document.addEventListener('click', event => {
			if ( getTarget(event, '[data-delete-card]') ) {
				const target = getTarget(event, '[data-delete-card]');
				const card = target.closest('.col');
				if (card.parentNode) {
					card.parentNode.removeChild(card);

					if (!document.querySelectorAll('.card-user').length) {
						this.isEmpty = true;
					}

					if (this.isEmpty) {
						this.isNoUserBlock.style.display = 'block';
					}
				}
			}
		})
	}

	onSearchUser() {
		this.fetchUserData()
			.then( userData => {
				if (userData) {
					console.log(userData);
					this.userData = userData;
					return userData.repos_url;
				} else {
					this.validate('User does not exist');
				}
			})
			.then( url => this.fetchUserRepos(url))
			.then( repoList => {
				this.userRepoList = repoList;
				this.renderCard();
			})
			.catch(error => console.log(error));
	}

	fetchUserData() {
		return fetch(this.url + this.userName)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					return false;
				}
			})
			.catch(error => console.log(error));
	}

	fetchUserRepos(url) {
		return fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					return false;
				}
			})
			.catch(error => console.log(error));
	}

	validate(text) {
		this.input.classList.add('error');
		this.errorMessage.textContent = text;
	}

	renderCard() {
		const {avatar_url, login, bio, location, html_url} = this.userData;
		const card = document.createElement('div');
		const bioText = bio ? bio : '';
		const locationText = location ? `From: ${location}` : `From: empty info`;
		const htmlUrlText = html_url
			? `GitHubUrl: <a href="${html_url}" class="card-link" target="_blank">${html_url}</a>`
			: `GitHubUrl: <span class="card-link">empty info</span>`;

		card.className = 'col card-user';

		card.innerHTML = `<div class="card h-100">
								<div class="w-100 text-end pt-2 pe-2">
									<button
										type="button"
										class="btn-close"
										aria-label="Close"
										data-delete-card></button>
								</div>
								<img src="${avatar_url}"
									 class="card-img-top rounded-circle m-auto mt-3 mb-3 avatar"
									 alt="GitHub User avatar">
								<div class="card-body">
									<h5 class="card-title text-center">${login}</h5>
									<p class="card-text text-body">${bioText}</p>
								</div>
								<ul class="list-group list-group-flush">
									<li class="list-group-item text-secondary">${locationText}</li>							
									<li class="list-group-item text-secondary">${htmlUrlText}</li>
								</ul>
								<p class="text text-muted text-uppercase ps-3 pt-2">Repo List:</p>
							  	<div class="repos ps-3 pe-3 pt-1 pb-3"></div>							
							</div>`;

		this.userRepoList.forEach( repo => {
			const repoBlock = document.createElement('a');
			repoBlock.href = repo.html_url;
			repoBlock.setAttribute('target', '_blank');
			repoBlock.classList.add('badge', 'bg-primary', 'm-1', 'text-light', 'text-decoration-none');
			repoBlock.textContent = repo.name;
			card.querySelector('.repos').appendChild(repoBlock);
		})

		this.addCard(card);
	}

	addCard(card) {
		if (this.isEmpty) {
			this.isNoUserBlock.style.display = 'none';
			this.usersContainer.appendChild(card);
		} else {
			this.usersContainer.appendChild(card);
		}

		this.isEmpty = false;
	}
}


export {GetGitHubUsers};