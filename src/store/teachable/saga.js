import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';

function* addDataset(action) {
	try {
		const parameter = yield call(apis.addTeachableDataset, action.payload);
		const data = parameter.data;
		yield put(reducer.actions.addDatasetSuccess(data));
	} catch (error) {
		yield put(reducer.actions.addDatasetFail(error));
	}
}
function* convertTeachableModel(action) {
	try {
		const parameter = yield call(apis.convertTeachableModel, action.payload);
		const data = parameter.data;
		yield put(reducer.actions.convertTeachableModelSuccess(data));
	} catch (error) {
		yield put(reducer.actions.convertTeachableModelFail(error));
	}
}
function* watchAddDataset() {
	yield takeLatest(reducer.ADD_DATASET, addDataset);
}
function* watchConvertTeachableModel() {
	yield takeLatest(reducer.CONVERT_TEACHABLE_MODEL, convertTeachableModel);
}


export default function* experimentsSaga() {
	yield all([fork(watchAddDataset)]);
}
export default function* experimentsSaga() {
	yield all([fork(watchConvertTeachableModel)]);
}
