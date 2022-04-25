import { all, fork, put, call, takeLatest, select } from 'redux-saga/effects';

import * as reducer from './reducer';
import apis from 'lib/apis';
import LocalStorageManager from 'utils/LocalStorageManager';

function* loadProject(action) {
	// const loadProject = (action) => {
	if (action.payload) {
		LocalStorageManager.setLoadedProject(action.payload);
		const state = yield select();
		const { currentUser } = state.auth;
		let isMine = action.payload.create_user === currentUser.create_user;
		yield put(reducer.actions.updateIsMyProject(isMine));
	} else {
		LocalStorageManager.setLoadedProject(null);
		yield put(reducer.actions.updateIsMyProject(false));
	}
	yield put(reducer.actions.setLoadTemplate(''));
}
function* getCommonStatus(action) {
	try {
		const state = yield select();
		if (!state.auth || !state.auth.isLoggedIn) {
			return;
		}
		const result = yield call(apis.getCommonStatus, action.payload);
		const data = result.data;
		yield put(reducer.actions.getCommonStatusSuccess(data));
	} catch (error) {
		// yield put(reducer.actions.loadModelsListFailure(error));
		yield put(reducer.actions.getCommonStatusFail(error));
	}
}
const loadTemplate = (action) => {
	if (action.payload) {
		LocalStorageManager.setLoadedTemplate(action.payload);
	} else {
		LocalStorageManager.setLoadedTemplate(null);
	}
};

function* watchLoadProject() {
	yield takeLatest(reducer.SET_LOAD_PROJECT, loadProject);
}
function* watchLoadTemplate() {
	yield takeLatest(reducer.SET_LOAD_TEMPLATE, loadTemplate);
}
function* watchGetCommonStatus() {
	yield takeLatest(reducer.GET_COMMON_STATUS, getCommonStatus);
}

export default function* commonSaga() {
	yield all([fork(watchLoadProject), fork(watchLoadTemplate), fork(watchGetCommonStatus)]);
}
