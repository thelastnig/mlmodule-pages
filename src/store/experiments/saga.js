import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';

function* loadList(action) {
	try {
		const result = yield call(apis.loadExperiments, action.payload);
		const data = result.data;
		yield put(reducer.actions.loadExperimentsListSuccess(data));
	} catch (error) {
		yield put(reducer.actions.loadExperimentsListFailure(error));
	}
}

function* loadDetail(action) {
	try {
		// const result = yield call(apis.loadExperimentsDetail, action.payload);
		// const data = result.data;
		// yield put(reducer.actions.loadExperimentsDetailSuccess(data.list));
		const parameter = yield call(apis.loadExperimentsParams, action.payload);
		const data = parameter.data;
		yield put(reducer.actions.loadExperimentsDetailSuccess(data));
	} catch (error) {
		yield put(reducer.actions.loadExperimentsDetailFailure(error));
	}
}

function* setStartTrain(action) {
	try {
		const parameter = yield call(apis.setStartTrain, action.payload);
		const data = parameter.data;
		yield put(reducer.actions.setStartTrainSuccess(data));
	} catch (error) {
		yield put(reducer.actions.setStartTrainFail(error));
	}
}

function* watchLoadList() {
	yield takeLatest(reducer.LOAD_LIST_REQUEST, loadList);
}
function* watchDetail() {
	yield takeLatest(reducer.LOAD_DETAIL_REQUEST, loadDetail);
}
function* watchSetStartTrain() {
	yield takeLatest(reducer.SET_START_REQUEST, setStartTrain);
}

export default function* experimentsSaga() {
	yield all([fork(watchLoadList), fork(watchDetail), fork(watchSetStartTrain)]);
}
