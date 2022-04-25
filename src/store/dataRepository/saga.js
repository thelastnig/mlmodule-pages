import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';

function* loadList(action) {
	try {
		const result = yield call(apis.getDataSetList, action.payload);
		const data = result.data;
		yield put(reducer.actions.getListSuccess(data));
	} catch (error) {
		yield put(reducer.actions.getListFailure(error));
	}
}

function* watchLoadList() {
	yield takeLatest(reducer.LOAD_LIST_REQUEST, loadList);
}

export default function* dataRepository() {
	yield all([fork(watchLoadList)]);
}
