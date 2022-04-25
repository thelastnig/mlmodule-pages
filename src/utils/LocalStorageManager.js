const LOGGED_IN_USER = 'loggedInUser';
const SELECTED_PROJECT = 'selectedProject';
const SELECTED_TEMPLATE = 'selectedTemplate';
const SEARCH_HISTORY = 'searchHistory';

const SEARCH_HISTORY_LENGTH_LIMIT = 5;

const TOOLTIP_HIDE_YN = 'tooltipHideYn';

const BACKGROUND_JOB = 'backgroundJob';

Storage.prototype.setObject = function (key, value) {
	this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
	const value = this.getItem(key);
	return value && JSON.parse(value);
};

class LocalStorageManager {
	static initialize() {
		LocalStorageManager.setLoggedInUser(null);
		LocalStorageManager.setLoadedProject(null);
		LocalStorageManager.setLoadedTemplate(null);
		LocalStorageManager.setSearchHistory({});
	}

	static initializeUser(loggedInUser) {
		LocalStorageManager.setLoggedInUser(loggedInUser);
		LocalStorageManager.setSearchHistory({});
	}

	static isAuthenticated() {
		const user = LocalStorageManager.getLoggedInUser();
		return user && new Date(user.access_expired_date).getTime() >= Date.now();
	}

	static getLoggedInUser() {
		return localStorage.getObject(LOGGED_IN_USER);
	}

	static getLoadedProjectId() {
		return localStorage.getObject(SELECTED_PROJECT).project_id;
	}

	static getLoadedProject() {
		return localStorage.getObject(SELECTED_PROJECT);
	}

	static getLoadedTemplate() {
		return localStorage.getObject(SELECTED_TEMPLATE);
	}

	static getSearchHistory(type) {
		try {
			return localStorage.getObject(SEARCH_HISTORY)[type];
		} catch (e) {
			return [];
		}
	}

	static isTooltipHide() {
		return localStorage.getObject(TOOLTIP_HIDE_YN);
	}

	static getBackgroundJob() {
		return localStorage.getObject(BACKGROUND_JOB);
	}

	static setLoadedProject(project) {
		localStorage.setObject(SELECTED_PROJECT, project);
	}

	static setLoadedTemplate(template) {
		localStorage.setObject(SELECTED_TEMPLATE, template);
	}

	static setLoggedInUser(user) {
		localStorage.setObject(LOGGED_IN_USER, user);
	}

	static setSearchHistory(searchHistory) {
		localStorage.setObject(SEARCH_HISTORY, searchHistory);
	}

	static setTooltipHide(yn) {
		localStorage.setObject(TOOLTIP_HIDE_YN, yn);
	}

	static setBackgroundJob(list) {
		localStorage.setObject(BACKGROUND_JOB, list);
	}

	static addSearchHistory(type, text) {
		if (!text) return;

		const searchHistory = localStorage.getObject(SEARCH_HISTORY);
		if (!searchHistory[type]) {
			searchHistory[type] = [];
		}

		const index = searchHistory[type].indexOf(text);
		if (index > -1) {
			searchHistory[type].splice(index, 1);
		}

		searchHistory[type].unshift(text);
		if (searchHistory[type].length > SEARCH_HISTORY_LENGTH_LIMIT) {
			searchHistory[type].pop();
		}
		localStorage.setObject(SEARCH_HISTORY, searchHistory);
	}

	static clear() {
		localStorage.clear();
	}
}

export default LocalStorageManager;
