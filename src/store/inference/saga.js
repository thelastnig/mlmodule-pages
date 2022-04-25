import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';

function* loadList(action) {
	try {
		const result = yield call(apis.getDataSetList, action.payload);
		const data = result.data;
		console.log(data.list);
		yield put(reducer.actions.getDataSetListSuccess(data));
	} catch (error) {
		yield put(reducer.actions.getDataSetListFailure(error));
	}
}
function* watchLoadList() {
	yield takeLatest(reducer.LOAD_LIST_REQUEST, loadList);
}

export default function* inferenceSaga() {
	yield all([fork(watchLoadList)]);
}
