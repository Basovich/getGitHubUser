import {getTarget} from "../../helper-function/get-target";

class GetGitHubUsers {
	constructor() {
		this.isEmpty = true;
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
					this.renderCard(userData);
				} else {
					this.validate('User does not exist');
				}
			})
	}

	fetchUserData() {
		return fetch(this.url + this.userName)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					return false;
				}
			});
	}

	validate(text) {
		this.input.classList.add('error');
		this.errorMessage.textContent = text;
	}

	renderCard(...userData) {
		const {avatar_url, login, bio, location, email, html_url} = userData[0];
		const card = document.createElement('div');
		const bioText = bio ? bio : '';
		const locationText = location ? `From: ${location}` : `From: empty info`;
		const emailText = email
			? `Email: <a href="mailto:${email}" class="card-link">${email}</a>`
			: `Email: <span class="card-link">empty info</span>`;
		const htmlUrlText = html_url
			? `GitUrl: <a href="${html_url}" class="card-link" target="_blank">${html_url}</a>`
			: `GitUrl: <span class="card-link">empty info</span>`;

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
									<li class="list-group-item text-secondary">${emailText}</li>
									<li class="list-group-item text-secondary">${htmlUrlText}</li>
								</ul>
							</div>`;

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