import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';

function* loadList(action) {
	try {
		let response = yield call(apis.getRegisteredModelVersionList, action.payload);
		const data = response.data;
		yield put(reducer.actions.getRegisteredModelVersionListSuccess(data));
	} catch (error) {
		yield put(reducer.actions.getRegisteredModelVersionListFail(error));
	}
}

function* watchLoadList() {
	yield takeLatest(reducer.GET_REGISTERED_MODEL_VERSION_LIST, loadList);
}

export default function* model_version_listSaga() {
	yield all([fork(watchLoadList)]);
}
