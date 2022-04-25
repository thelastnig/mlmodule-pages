import produce from '../produce';

export const LOGIN_REQUEST = 'user/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'user/LOGIN_FAILURE';
export const UPDATE_USER_INFO = 'user/UPDATE_USER_INFO';
export const SIGNOUT_REQUEST = 'user/SIGNOUT_REQUEST';
export const SIGNOUT_SUCCESS = 'user/SIGNOUT_SUCCESS';
export const TOKEN_EXPIRED = 'user/TOKEN_EXPIRED';
export const REFRESH_TOKEN = 'user/REFRESH_TOKEN';
export const SET_ID_ADMIN = 'user/SET_ID_ADMIN';
export const SET_REQUIRED_CHANGE_PASSWORD = 'user/SET_REQUIRED_CHANGE_PASSWORD';

const loginRequest = (data) => ({ type: LOGIN_REQUEST, payload: data });
const loginSuccess = (data) => ({ type: LOGIN_SUCCESS, payload: data });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });
const updateUserInfo = (data) => ({ type: UPDATE_USER_INFO, payload: data });
const signOutRequest = (data) => ({ type: SIGNOUT_REQUEST, payload: data });
const signOutSuccess = (data) => ({ type: SIGNOUT_SUCCESS, payload: data });
const tokenExpired = (data) => ({ type: TOKEN_EXPIRED, payload: data });
const refreshToken = (data) => ({ type: REFRESH_TOKEN, payload: data });
const setIsAdmin = (data) => ({ type: SET_ID_ADMIN, payload: data });
const setRequiredChangePW = (data) => ({ type: SET_REQUIRED_CHANGE_PASSWORD, payload: data });

export const actions = {
	loginRequest,
	loginSuccess,
	loginFailure,
	updateUserInfo,
	signOutRequest,
	signOutSuccess,
	tokenExpired,
	refreshToken,
	setIsAdmin,
	setRequiredChangePW,
};

// * 사용자 권한
// 1) ROD : 개발자 화면 전 메뉴 활성화
// 2) RON : annotation 메뉴만 활성화, 나머지 메뉴는 비활성화
// 3) ROA : 관리자 화면 전 메뉴 활성화
const ADMIN_ROLE = 'ROA';
const initialState = {
	isLoggedIn: false,
	currentUser: null,
	isAdmin: false,
	role_name: '',
	access_token: '',
	refresh_token: '',
	error: null,
	access_expired_date: null,
	logInUserId: '',
	force_password_change: false,
	last_connection_time: null,
	isRequiredChangePW: false,
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case LOGIN_REQUEST:
				draft.error = '';
				if (action && action.payload && action.payload.user_id) {
					draft.logInUserId = action.payload.user_id;
				}
				draft.force_password_change = false;
				draft.last_connection_time = null;
				break;
			case LOGIN_SUCCESS:
				draft.isLoggedIn = true;
				draft.currentUser = action.payload;
				draft.isAdmin = draft.currentUser?.role === ADMIN_ROLE;
				draft.role_name = draft.currentUser?.role_name;
				draft.access_token = draft.currentUser?.access_token_value;
				draft.refresh_token = draft.currentUser?.refresh_token_value;
				draft.access_expired_date = draft.currentUser?.access_expired_date;
				draft.logInUserId = '';
				draft.force_password_change = draft.currentUser?.force_password_change;
				draft.last_connection_time = draft.currentUser?.last_connection_time;
				draft.isRequiredChangePW = draft.force_password_change || !draft.last_connection_time;
				break;
			case LOGIN_FAILURE:
				draft.isLoggedIn = false;
				draft.currentUser = {};
				draft.isAdmin = false;
				draft.role_name = '';
				draft.error = action.payload;
				draft.access_token = '';
				draft.refresh_token = '';
				draft.access_expired_date = '';
				draft.isRequiredChangePW = false;
				break;
			case UPDATE_USER_INFO:
				draft.isLoggedIn = true;
				draft.currentUser = action.payload;
				draft.isAdmin = draft.currentUser?.role === ADMIN_ROLE;
				draft.role_name = draft.currentUser?.role_name;
				draft.access_token = draft.currentUser?.access_token_value;
				draft.refresh_token = draft.currentUser?.refresh_token_value;
				break;
			case SIGNOUT_REQUEST:
				break;
			case SIGNOUT_SUCCESS:
				console.log('action = ', action);
				draft.isLoggedIn = false;
				draft.currentUser = {};
				draft.isAdmin = false;
				draft.role_name = '';
				draft.access_token = '';
				draft.refresh_token = '';
				break;
			case TOKEN_EXPIRED:
				draft.isLoggedIn = false;
				draft.currentUser = {};
				draft.isAdmin = false;
				draft.role_name = '';
				draft.access_token = '';
				draft.refresh_token = '';
				break;
			case REFRESH_TOKEN:
				console.log('common api REFRESH_TOKEN = ', action.payload);
				draft.isLoggedIn = true;
				draft.currentUser = action.payload;
				draft.isAdmin = draft.currentUser?.role === ADMIN_ROLE;
				draft.role_name = draft.currentUser?.role_name;
				draft.access_token = draft.currentUser?.access_token_value;
				draft.refresh_token = draft.currentUser?.refresh_token_value;
				break;
			case SET_ID_ADMIN:
				draft.isAdmin = action.payload;
				break;
			case SET_REQUIRED_CHANGE_PASSWORD:
				draft.isRequiredChangePW = action.payload;
				break;
			default:
				return state;
		}
	});

export default reducer;
