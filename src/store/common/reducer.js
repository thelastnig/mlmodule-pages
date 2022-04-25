import produce from '../produce';
import LocalStorageManager from 'utils/LocalStorageManager';

export const SET_LOAD_PROJECT = 'project/SET_LOAD_PROJECT';
export const SET_LOAD_TEMPLATE = 'project/SET_LOAD_TEMPLATE';

export const SHOW_ALERT_DLG = 'common/SHOW_ALERT_DLG';
export const HIDE_ALERT_DLG = 'common/HIDE_ALERT_DLG';

export const SHOW_CONFIRM_DLG = 'common/SHOW_CONFIRM_DLG';
export const HIDE_CONFIRM_DLG = 'common/HIDE_CONFIRM_DLG';
export const UPDATE_IS_MY_PROJECT = 'common/UPDATE_IS_MY_PROJECT';

export const SHOW_SPINNER = 'common/SHOW_SPINNER';
export const HIDE_SPINNER = 'common/HIDE_SPINNER';
export const ABORT_SPINNER = 'common/ABORT_SPINNER';

export const GET_COMMON_STATUS = 'common/GET_COMMON_STATUS';
export const GET_COMMON_STATUS_SUCCESS = 'common/GET_COMMON_STATUS_SUCCESS';
export const GET_COMMON_STATUS_FAIL = 'common/GET_COMMON_STATUS_FAIL';
export const INIT_COMMON_STATUS = 'common/INIT_COMMON_STATUS';

export const SET_TOOLTIP_HIDE = 'common/SET_TOOLTIP_HIDE';

export const BACKGROUND_JOB_ADD = 'common/BACKGROUND_JOB_ADD';
export const BACKGROUND_JOB_FINISH = 'common/BACKGROUND_JOB_FINISH';
export const SET_BACKGROUND_ERR_TXT = 'common/SET_BACKGROUND_ERR_TXT';
export const INIT_BACKGROUND_ERR_TXT = 'common/INIT_BACKGROUND_ERR_TXT';
export const SET_BACKGROUND_JOB = 'common/SET_BACKGROUND_JOB';

const setLoadProject = (data) => ({ type: SET_LOAD_PROJECT, payload: data });
const setLoadTemplate = (data) => ({ type: SET_LOAD_TEMPLATE, payload: data });
const updateIsMyProject = (data) => ({ type: UPDATE_IS_MY_PROJECT, payload: data });

const showSpinner = (data) => ({ type: SHOW_SPINNER, payload: data });
const hideSpinner = (data) => ({ type: HIDE_SPINNER, payload: data });
const abortSpinner = (data) => ({ type: ABORT_SPINNER, payload: data });

const getCommonStatus = (data) => ({ type: GET_COMMON_STATUS, payload: data });
const getCommonStatusSuccess = (data) => ({ type: GET_COMMON_STATUS_SUCCESS, payload: data });
const getCommonStatusFail = (data) => ({ type: GET_COMMON_STATUS_FAIL, payload: data });
const initCommonStatus = (data) => ({ type: INIT_COMMON_STATUS, payload: data });

const setToolTipHide = (data) => ({ type: SET_TOOLTIP_HIDE, payload: data });

const addBackgroundJob = (data) => ({ type: BACKGROUND_JOB_ADD, payload: data });
const finishBackgroundJob = (data) => ({ type: BACKGROUND_JOB_FINISH, payload: data });
const setBackgroundErrTxt = (data) => ({ type: SET_BACKGROUND_ERR_TXT, payload: data });
const initBackgroundErrTxt = () => ({ type: INIT_BACKGROUND_ERR_TXT });
const setBackgroundJob = (data) => ({ type: SET_BACKGROUND_JOB, payload: data });

export const actions = {
	setLoadProject,
	setLoadTemplate,
	updateIsMyProject,
	showSpinner,
	hideSpinner,
	abortSpinner,
	getCommonStatus,
	getCommonStatusSuccess,
	getCommonStatusFail,
	initCommonStatus,
	setToolTipHide,
	addBackgroundJob,
	finishBackgroundJob,
	setBackgroundErrTxt,
	initBackgroundErrTxt,
	setBackgroundJob,
};

const initialState = {
	loadProject: '',
	loadProjectType: '',
	loadTemplate: '',
	loadTemplate_dataset_id: '',
	alert_message: '',
	confirm_message: '',
	okCB: null,
	cancelCB: null,
	isMyProject: false, // 로드된 프로젝트가 내 프로젝트인지의 여부
	spinnerCount: 0,

	run: false,
	inference: false,
	preprocess: false,
	analyze: false,
	alarm: false,
	deploy: false,

	isToolTipHide: false,

	backgroundJobList: [],
	backgroundErrorTxt: '',
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case SET_LOAD_PROJECT:
				draft.loadProject = action.payload;
				draft.loadProjectType = action.payload ? action.payload.type : '';
				break;
			case UPDATE_IS_MY_PROJECT:
				draft.isMyProject = action.payload;
				break;
			case SET_LOAD_TEMPLATE:
				draft.loadTemplate = action.payload;
				draft.loadTemplate_dataset_id = action.payload ? action.payload.dataset.dataset_id : '';
				break;
			case SHOW_ALERT_DLG:
				console.log('dsds SHOW_ALERT_DLG message = ', action.payload.message);
				draft.alert_message = action.payload.message;
				draft.okCB = action.payload.okCB;
				break;
			case HIDE_ALERT_DLG:
				draft.alert_message = '';
				draft.okCB = null;
				break;
			case SHOW_CONFIRM_DLG:
				draft.confirm_message = action.payload.message;
				draft.okCB = action.payload.okCB;
				draft.cancelCB = action.payload.cancelCB;
				break;
			case HIDE_CONFIRM_DLG:
				draft.confirm_message = '';
				draft.okCB = null;
				draft.cancelCB = null;
				break;
			case SHOW_SPINNER:
				draft.spinnerCount += 1;
				break;
			case HIDE_SPINNER:
				draft.spinnerCount = (draft.spinnerCount > 0) ? draft.spinnerCount - 1 : 0;
				break;
			case ABORT_SPINNER:
				draft.spinnerCount = 0;
				break;
			case GET_COMMON_STATUS_SUCCESS:
				let { list } = action.payload;
				list.forEach((v) => {
					let { menu, status, start_date } = v;
					if (menu === 'alarm') {
						draft[menu] = status;
					} else {
						draft[menu] = start_date;
					}
				});
				break;
			case GET_COMMON_STATUS_FAIL:
			case INIT_COMMON_STATUS:
				draft.run = false;
				draft.inference = false;
				draft.preprocess = false;
				draft.analyze = false;
				draft.alarm = false;
				draft.deploy = false;
				break;
			case SET_TOOLTIP_HIDE:
				draft.isToolTipHide = action.payload;
				break;
			case BACKGROUND_JOB_ADD:
				draft.backgroundJobList = [...draft.backgroundJobList, action.payload];
				LocalStorageManager.setBackgroundJob(draft.backgroundJobList);
				break;
			case BACKGROUND_JOB_FINISH:
				draft.backgroundJobList = draft.backgroundJobList.filter(job => job !== action.payload);
				LocalStorageManager.setBackgroundJob(draft.backgroundJobList);
				break;
			case SET_BACKGROUND_ERR_TXT:
				draft.backgroundJobList = draft.backgroundJobList.filter(job => job !== action.payload.type);
				LocalStorageManager.setBackgroundJob(draft.backgroundJobList);
				draft.backgroundErrorTxt = action.payload.errTxt;
				break;
			case INIT_BACKGROUND_ERR_TXT:
				draft.backgroundErrorTxt = '';
				break;
			default:
				return state;
		}
	});

export default reducer;
