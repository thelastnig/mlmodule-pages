import { all, fork, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';

function* loadLog(action) {
	try {
		yield call(apis.loadLog, action.payload);
	} catch (error) {}
}

function* watchLoadLog() {
	yield takeLatest(reducer.LOAD_LOG_REQUEST, loadLog);
}

export default function* logSaga() {
	yield all([fork(watchLoadLog)]);
}
