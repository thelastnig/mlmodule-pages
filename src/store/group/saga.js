import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';

function* loadGroup(action) {
	try {
		const result = yield call(apis.getGroupList, action.payload);
		const data = result.data;
		console.log(data);
		yield put(reducer.actions.loadGroupListSuccess(data));
	} catch (error) {
		// yield put(reducer.actions.loadModelsListFailure(error));
		yield put(reducer.actions.loadGroupListFailure(error));
	}
}

function* watchLoadGroupList() {
	yield takeLatest(reducer.LOAD_GROUP_LIST, loadGroup);
}

export default function* groupSaga() {
	yield all([fork(watchLoadGroupList)]);
}
