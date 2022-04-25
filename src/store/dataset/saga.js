import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';
import * as commonReducer from 'store/common/reducer';

import { BACKGROUND_JOB_TYPE } from 'constants/common';

import apis from 'lib/apis';

import Object2FormParser from 'utils/Object2FormParser';

function* loadList(action) {
	try {
		const result = yield call(apis.getDataSetList, action.payload);
		const data = result.data;
		console.log(data.list);
		yield put(reducer.actions.getListSuccess(data));
	} catch (error) {
		yield put(reducer.actions.getListFailure(error));
	}
}
function* loadDetail(action) {
	try {
		const result = yield call(apis.getDatasetDetail, action.payload);
		const data = result.data;
		console.log(data);
		yield put(reducer.actions.getDetailSuccess(data));
	} catch (error) {
		yield put(reducer.actions.getDetailFail(error));
	}
}
function* mergeData(action) {
	try {
		yield put(commonReducer.actions.addBackgroundJob(BACKGROUND_JOB_TYPE.DATA_MERGE));

		const result = yield call(apis.mergeData, Object2FormParser.parse(action.payload));
		yield put(reducer.actions.mergeDataSuccess(result));
	} catch (error) {
		yield put(reducer.actions.mergeDataFailure(error));
		const errTxt = (error && error.data && error.data.detail) ? error.data.detail : '데이터 병합에 실패하였습니다. 관리자에게 문의하세요.';
		yield put(commonReducer.actions.setBackgroundErrTxt({
			type: BACKGROUND_JOB_TYPE.DATA_MERGE, 
			errTxt,
		}));
	}
}
function* replaceLabel(action) {
	try {
		yield put(commonReducer.actions.addBackgroundJob(BACKGROUND_JOB_TYPE.LABEL_REPLACE));

		const result = yield call(apis.modifyLabel, action.payload);
		yield put(reducer.actions.replaceLabelSuccess(result.data));
	} catch (error) {
		yield put(reducer.actions.replaceLabelFailure(error));
		const errTxt = '라벨교체에 실패하였습니다. 관리자에게 문의하세요.';
		yield put(commonReducer.actions.setBackgroundErrTxt({
			type: BACKGROUND_JOB_TYPE.LABEL_REPLACE, 
			errTxt,
		}));
	}
}

function* watchLoadList() {
	yield takeLatest(reducer.LOAD_LIST_REQUEST, loadList);
}
function* watchLoadDetail() {
	yield takeLatest(reducer.GET_DETAIL_REQUEST, loadDetail);
}
function* watchMergeData() {
	yield takeLatest(reducer.MERGE_DATA_REQUEST, mergeData);
}
function* watchLabelReplace() {
	yield takeLatest(reducer.REPLACE_LABEL_REQUEST, replaceLabel);
}

export default function* datasetSaga() {
	yield all([
		fork(watchLoadList), 
		fork(watchLoadDetail),
		fork(watchMergeData),
		fork(watchLabelReplace),		
	]);
}
