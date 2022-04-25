import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';

function* loadSplitParamT(action) {
	try {
		const result = yield call(apis.loadSplitParamT, action.payload);
		const data = result.data;
		yield put(reducer.actions.loadSplitParamTSuccess(data));
	} catch (error) {
		yield put(reducer.actions.loadSplitParamTFailure(error));
	}
}
function* loadSplitParamC(action) {
	try {
		const result = yield call(apis.loadSplitParamC, action.payload);
		const data = result.data;
		yield put(reducer.actions.loadSplitParamCSuccess(data));
	} catch (error) {
		yield put(reducer.actions.loadSplitParamCFailure(error));
	}
}
function* loadPresetList(action) {
	try {
		const result = yield call(apis.loadPresetList, action.payload);
		const { list } = result.data;
		yield put(reducer.actions.loadPresetListSuccess(list));
	} catch (error) {
		yield put(reducer.actions.loadPresetListFailure(error));
	}
}

function* watchLoadSplitParamT() {
	yield takeLatest(reducer.LOAD_SPLIT_PARAM_T_REQUEST, loadSplitParamT);
}
function* watchLoadSplitParamC() {
	yield takeLatest(reducer.LOAD_SPLIT_PARAM_C_REQUEST, loadSplitParamC);
}
function* watchLoadPresetList() {
	yield takeLatest(reducer.LOAD_PRESET_LIST_REQUEST, loadPresetList);
}

export default function* settingSaga() {
	yield all([fork(watchLoadSplitParamT), fork(watchLoadSplitParamC), fork(watchLoadPresetList)]);
}
