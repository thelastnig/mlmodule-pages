import { all, fork, put, call, takeLatest } from 'redux-saga/effects';

import * as reducer from './reducer';

import apis from 'lib/apis';
import LocalStorageManager from 'utils/LocalStorageManager';

function* callGetProgressStatus(action){
	try{		
		const result = yield call(apis.getProgressStatus, action.payload);
		const data = result.data;
		console.log(data);	
		yield put(reducer.actions.callGetProgressStatusSuccess(data));	
	}catch(error){
		yield put(reducer.actions.callGetProgressStatusFailure(error));
	}
}
function* loadProjects(action) {
	try {
		const result = yield call(apis.loadProjects, action.payload);
		const data = result.data;
		console.log(data);
		yield put(reducer.actions.loadProjectListSuccess(data));
	} catch (error) {
		yield put(reducer.actions.loadProjectListFailure(error));
	}
}

function* updateSelectProject(action) {
	try {
		const projectInfo = LocalStorageManager.getLoadedProject();
		if (projectInfo) {
			yield put(reducer.actions.setSelectProject(projectInfo));
		}
	} catch (error) {}
}

function* watchLoadProject() {
	yield takeLatest(reducer.LOAD_LIST_REQUEST, loadProjects);
}
function* watchUpdateSelectProject() {
	yield takeLatest(reducer.UPDATE_SELECT_PROJECT, updateSelectProject);
}

function* watchCallGetProgressStatus(){
	yield takeLatest(reducer.CALL_GET_PROGRESS_STATUS_REQUEST, callGetProgressStatus);
}

export default function* projectSaga() {
	yield all([fork(watchLoadProject), fork(watchUpdateSelectProject), fork(watchCallGetProgressStatus)]);
}
