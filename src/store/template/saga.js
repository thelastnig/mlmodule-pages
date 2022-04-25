import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';

function* loadList(action) {
	try {
		console.log('dsds load lsit');
		const result = yield call(apis.getTemplateList, action.payload);
		const data = result.data;
		console.log(data.list);
		yield put(reducer.actions.getTemplateListSuccess(data));
	} catch (error) {
		yield put(reducer.actions.getTemplateListFailure(error));
	}
}
function* loadDetail(action) {
	try {
		console.log('dsds load lsit');
		const result = yield call(apis.loadExperimentsParams, action.payload);
		const data = result.data;
		console.log(data);
		yield put(reducer.actions.getTemplateDetailSuccess(data));
	} catch (error) {
		yield put(reducer.actions.getTemplateDetailFail(error));
	}
}

function* watchLoadList() {
	yield takeLatest(reducer.LOAD_LIST_REQUEST, loadList);
}
function* watchLoadDetail() {
	yield takeLatest(reducer.GET_TEMPLATE_DETAIL_REQUEST, loadDetail);
}

export default function* templateSaga() {
	yield all([fork(watchLoadList), fork(watchLoadDetail)]);
}
