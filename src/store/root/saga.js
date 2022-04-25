import { all, fork } from 'redux-saga/effects';

import authSaga from '../auth/saga';
import projectSaga from '../project/saga';
import experimentsSaga from '../experiments/saga';
import modelsSaga from '../models/saga';
import settingSaga from '../setting/saga';
import logSaga from '../log/saga';
import commonSaga from 'store/common/saga';
import groupSaga from '../group/saga';
import templateSaga from '../template/saga';
import datasetSaga from '../dataset/saga';
import annotatorSaga from '../annotator/saga';
import alarmSaga from '../alarm/saga';
import inferenceSaga from '../inference/saga';
import userSaga from '../user/saga';
import usergroupSaga from '../usergroup/saga';
import annotationSaga from '../annotation/saga';
import model_version_listSaga from '../model_version_list/saga';
import monitorSaga from '../monitor/saga';
import resourceSaga from '../resource/saga';
import dataRepository from '../dataRepository/saga';
import projectRepository from '../projectRepository/saga';
import algorithmSaga from '../algorithm/saga';

export default function* rootSaga() {
	yield all([
		fork(authSaga),
		fork(projectSaga),
		fork(experimentsSaga),
		fork(modelsSaga),
		fork(settingSaga),
		fork(logSaga),
		fork(commonSaga),
		fork(groupSaga),
		fork(templateSaga),
		fork(datasetSaga),
		fork(annotatorSaga),
		fork(alarmSaga),
		fork(inferenceSaga),
		fork(userSaga),
		fork(usergroupSaga),
		fork(annotationSaga),
		fork(model_version_listSaga),
		fork(monitorSaga),
		fork(resourceSaga),
		fork(dataRepository),
		fork(projectRepository),
		fork(algorithmSaga),
	]);
}
