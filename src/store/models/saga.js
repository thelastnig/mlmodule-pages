import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';

function* loadList(action) {
	try {
		const result = yield call(apis.loadModels, action.payload);
		const data = result.data;
		console.log(data.list);
		yield put(reducer.actions.loadModelsListSuccess(data));
	} catch (error) {
		yield put(reducer.actions.loadModelsListFailure(error));
	}
}
function* loadDetail(action) {
	try {
		let response = yield call(apis.loadModelDetail, action.payload);
		let data = response.data;
		console.log(data);
		yield put(reducer.actions.loadModelDetailSuccess(data));
	} catch (error) {
		yield put(reducer.actions.loadModelDetailFailure(error));
	}
}
function* loadVersionDetail(action) {
	try {
		let response = yield call(apis.loadModeVersionlDetail, action.payload);
		let data = response.data;
		let { version_info } = data;
		yield put(reducer.actions.loadModelVersionDetailSuccess(version_info));
	} catch (error) {
		yield put(reducer.actions.loadModelDetailFailure(error));
	}
}

function* watchLoadList() {
	yield takeLatest(reducer.LOAD_LIST_REQUEST, loadList);
}
function* watchModelDetail() {
	yield takeLatest(reducer.LOAD_MODEL_DETAIL, loadDetail);
}
function* watchModelVersionDetail() {
	yield takeLatest(reducer.LOAD_MODEL_VERSION_DETAIL, loadVersionDetail);
}

export default function* modelsSaga() {
	yield all([fork(watchLoadList), fork(watchModelDetail), fork(watchModelVersionDetail)]);
}
