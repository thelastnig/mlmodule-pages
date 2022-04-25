import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import apis from 'lib/apis';
import * as reducer from './reducer';

function* loadAlgorithmList(action) {
	try {
		const result = yield call(apis.getAlgorithmList, action.payload);
		const data = result.data;
		yield put(reducer.actions.getAlgorithmListSuccess(data));
	} catch (error) {
		yield put(reducer.actions.getAlgorithmListFailure(error));
	}
}

function* watchLoadAlgorithmList() {
	yield takeLatest(reducer.LOAD_ALGORITHM_LIST_REQUEST, loadAlgorithmList);
}

export default function* settingSaga() {
	yield all([fork(watchLoadAlgorithmList)]);
}
