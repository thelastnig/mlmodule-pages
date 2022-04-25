import { combineReducers } from 'redux';
import auth from '../auth/reducer';
import project from '../project/reducer';
import experiments from '../experiments/reducer';
import models from '../models/reducer';
import setting from '../setting/reducer';
import log from '../log/reducer';
import common from 'store/common/reducer';
import group from '../group/reducer';
import template from '../template/reducer';
import dataset from '../dataset/reducer';
import annotator from '../annotator/reducer';
import alarm from '../alarm/reducer';
import inference from '../inference/reducer';
import user from '../user/reducer';
import usergroup from '../usergroup/reducer';
import annotation from '../annotation/reducer';
import model_version_list from '../model_version_list/reducer';
import monitor from '../monitor/reducer';
import resource from '../resource/reducer';
import dataRepository from '../dataRepository/reducer';
import projectRepository from '../projectRepository/reducer';
import algorithm from '../algorithm/reducer';
import graph from '../graph/reducer';
import alert from '../alert/reducer';
import dialog from '../dialog/reducer';
import teachable from '../teachable/reducer';

const rootReducer = combineReducers({
	auth,
	project,
	experiments,
	models,
	setting,
	log,
	common,
	group,
	template,
	dataset,
	annotator,
	alarm,
	inference,
	user,
	usergroup,
	annotation,
	model_version_list,
	monitor,
	resource,
	dataRepository,
	projectRepository,
	algorithm,
	graph,
	alert,
	dialog,
	teachable,
});

export default rootReducer;
