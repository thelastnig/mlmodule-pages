import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';
import * as reducerCommon from 'store/common/reducer';

import apis from 'lib/apis';
import LocalStorageManager from 'utils/LocalStorageManager';

function* loginRequest(action) {
	try {
		const result = yield call(apis.login, action.payload);
		const data = result.data;
		const userInfo = data?.access_token_value ? data : {};
		console.log(userInfo);
		yield call(apis.setToken, userInfo);
		yield put(reducer.actions.loginSuccess(userInfo));
		setSession(userInfo);
	} catch (error) {
		console.log('login fail');
		// demo code
		let isDemo = false;
		if (isDemo) {
			let userInfo = {
				access_expired_date: 202011251120,
				access_token_value:
					'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2ZWxvcGVydC5jb20iLCJleHAiOiIxNDg1MjcwMDAwMDAwIiwiaHR0cHM6Ly92ZWxvcGVydC5jb20vand0X2NsYWltcy9pc19hZG1pbiI6dHJ1ZSwidXNlcklkIjoiMTEwMjgzNzM3MjcxMDIiLCJ1c2VybmFtZSI6InZlbG9wZXJ0In0',
				create_date: '2020-10-23 22:13:40',
				create_user: 'yrkim',
				refresh_expired_date: 202012251120,
				refresh_token_value:
					'acdsdfXCERQASDDFGDGSD13Dg1MjcwMDAwMDAwIiwiaHR0cHM6Ly92ZWxvcGVydC5jb20vand0X2NsYWltcy9pc19hZG1pbiI6dHJ1ZSwidXNlcklkIjoiMTEwMjgzNzM3MjcxMDIiLCJ1c2VybmFtZSI6InZlbG9wZXJ0In0',
				role: 'ROD',
				role_name: 'Model developer',
				status_id: 'STU',
				status_name: '사용중',
				update_date: '2020-10-23 22:13:40',
				update_user: 'yrkim',
				user_id: 'yrkim@hae.com',
				user_nm: 'yrkim',
			};
			yield put(reducer.actions.loginSuccess(userInfo));
			setSession(userInfo);
		} else {
			setSession();
			yield put(reducer.actions.loginFailure(error));
		}
	}
}

function* signOutRequest(action) {
	try {
		yield call(apis.logout, action.payload);
		setSession();
		yield put(reducer.actions.signOutSuccess(''));
		yield put(reducerCommon.actions.setLoadProject(''));
		yield put(reducerCommon.actions.setLoadTemplate(''));
	} catch (error) {
		setSession();
		yield put(reducerCommon.actions.setLoadProject(''));
		yield put(reducerCommon.actions.setLoadTemplate(''));
	}
}

const setSession = (userInfo = null) => {
	LocalStorageManager.initializeUser(userInfo);
};

const tokenExpired = (userInfo) => {
	LocalStorageManager.initialize();
};

const refreshToken = (data) => {
	const userInfo = data.payload;
	LocalStorageManager.initializeUser(userInfo);
};

function* watchLoginRequest() {
	yield takeLatest(reducer.LOGIN_REQUEST, loginRequest);
}
function* watchSignOutRequest() {
	yield takeLatest(reducer.SIGNOUT_REQUEST, signOutRequest);
}
function* watchTokenExpired() {
	yield takeLatest(reducer.TOKEN_EXPIRED, tokenExpired);
}
function* watchRefreshToken() {
	yield takeLatest(reducer.REFRESH_TOKEN, refreshToken);
}

export default function* authSaga() {
	yield all([fork(watchLoginRequest), fork(watchSignOutRequest), fork(watchTokenExpired), fork(watchRefreshToken)]);
}
