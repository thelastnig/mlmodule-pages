import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';

function* getList(action) {
	try {
		const result = yield call(apis.getUserList, action.payload);
		const data = result.data;
		console.log(data);
		yield put(reducer.actions.getListSuccess(data));
	} catch (error) {
		// yield put(reducer.actions.loadModelsListFailure(error));
		yield put(reducer.actions.getListFailure(error));
	}
}

function* watchGetList() {
	yield takeLatest(reducer.GET_LIST, getList);
}

export default function* userSaga() {
	yield all([fork(watchGetList)]);
}
