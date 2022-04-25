import produce from '../produce';

export const LOAD_LIST_REQUEST = 'experiments/LOAD_LIST_REQUEST';
export const LOAD_LIST_SUCCESS = 'experiments/LOAD_LIST_SUCCESS';
export const LOAD_LIST_FAILURE = 'experiments/LOAD_LIST_FAILURE';
export const SET_START_REQUEST = 'experiments/SET_START_REQUEST';
export const SET_START_SUCCESS = 'experiments/SET_START_SUCCESS';
export const SET_START_FAILURE = 'experiments/SET_START_FAILURE';
export const LOAD_DETAIL_REQUEST = 'experiments/detail/LOAD_LIST_REQUEST';
export const LOAD_DETAIL_SUCCESS = 'experiments/detail/LOAD_LIST_SUCCESS';
export const LOAD_DETAIL_FAILURE = 'experiments/detail/LOAD_LIST_FAILURE';
export const INIT_DETAIL_REQUEST = 'experiments/detail/INIT_DETAIL_REQUEST';
// export const GET_EXPERIMENT_PARAM_REQUEST_REQUEST = 'experiments/GET_EXPERIMENT_PARAM_REQUEST_REQUEST';
export const GET_EXPERIMENT_PARAM_REQUEST_SUCCESS = 'experiments/detail/GET_EXPERIMENT_PARAM_REQUEST_SUCCESS';
// export const GET_EXPERIMENT_PARAM_REQUEST_FAILURE = 'experiments/detail/GET_EXPERIMENT_PARAM_REQUEST_FAILURE';
export const UPDATE_SORTING = 'experiments/UPDATE_SORTING';
export const INIT_DATA = 'experiments/TEMPLATE_INIT_DATA';

const loadExperimentsList = (data) => ({ type: LOAD_LIST_REQUEST, payload: data });
const loadExperimentsListSuccess = (data) => ({ type: LOAD_LIST_SUCCESS, payload: data });
const loadExperimentsListFailure = (error) => ({ type: LOAD_LIST_FAILURE, payload: error });
const loadExperimentsDetail = (data) => ({ type: LOAD_DETAIL_REQUEST, payload: data });
const initExperimentsDetail = (data) => ({ type: INIT_DETAIL_REQUEST, payload: data });
const loadExperimentsDetailSuccess = (data) => ({ type: LOAD_DETAIL_SUCCESS, payload: data });
const loadExperimentsDetailFailure = (error) => ({ type: LOAD_DETAIL_FAILURE, payload: error });
// const getExperimentParam = (data) => ({ type: GET_EXPERIMENT_PARAM_REQUEST_REQUEST, payload: data });
const getExperimentParamSuccess = (data) => ({ type: GET_EXPERIMENT_PARAM_REQUEST_SUCCESS, payload: data });
// const getExperimentParamFailure = (error) => ({ type: GET_EXPERIMENT_PARAM_REQUEST_FAILURE, payload: error });

//체크박스를 reset한 후에 호출할 aciton 추가 구현 필요

const setStartTrain = (data) => ({ type: SET_START_REQUEST, payload: data });
const setStartTrainSuccess = (data) => ({ type: SET_START_SUCCESS, payload: data });
const setStartTrainFail = (data) => ({ type: SET_START_FAILURE, payload: data });
const updateSorting = (data) => ({ type: UPDATE_SORTING, payload: data });
const initData = (data) => ({ type: INIT_DATA, payload: data });
export const actions = {
	loadExperimentsList,
	loadExperimentsListSuccess,
	loadExperimentsListFailure,
	initExperimentsDetail,
	loadExperimentsDetail,
	loadExperimentsDetailSuccess,
	loadExperimentsDetailFailure,
	// getExperimentParam,
	getExperimentParamSuccess,
	// getExperimentParamFailure,

	setStartTrain,
	setStartTrainSuccess,
	setStartTrainFail,
	updateSorting,
	initData,
};

const initialState = {
	loadListSuccess: false,
	loadListError: null,
	list: [],
	row_count: 11,
	total_row_count: -1,
	sorting: 'create_date',
	sorting_type: false, //true:'asc', false:'desc'
	loadDetailSuccess: false,
	loadDetailError: null,
	detail: {},
	algorithm_name: '',
	algorithm_size: null,
	preset_name: '',
	params: {},
	refreshCheckbox: false,
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case UPDATE_SORTING:
				draft.sorting = action.payload.sorting;
				draft.sorting_type = action.payload.sorting_type;
				break;
			case INIT_DATA:
				draft.sorting = 'create_date';
				draft.sorting_type = false;
				break;
			case LOAD_LIST_REQUEST:
				draft.loadListSuccess = false;
				draft.loadListError = null;
				draft.list = [];
				draft.total_row_count = -1;
				break;
			case LOAD_LIST_SUCCESS:
				draft.loadListSuccess = true;
				draft.loadListError = null;
				let list = action.payload.list;
				list.map((item) => draft.list.push(item));
				draft.total_row_count = action.payload.total_row_count;
				draft.refreshCheckbox = true;
				break;
			case LOAD_LIST_FAILURE:
				draft.loadListSuccess = false;
				draft.loadListError = action.payload;
				draft.list = [];
				draft.total_row_count = -1;
				break;
			case LOAD_DETAIL_REQUEST:
				draft.loadDetailSuccess = false;
				draft.loadDetailError = null;
				draft.detail = {};
				break;
			case LOAD_DETAIL_SUCCESS:
				draft.loadDetailSuccess = true;
				draft.loadDetailError = null;
				draft.detail = action.payload;
				break;
			case LOAD_DETAIL_FAILURE:
				draft.loadDetailSuccess = false;
				draft.loadDetailError = action.payload;
				draft.detail = [];
				break;
			// case GET_EXPERIMENT_PARAM_REQUEST_REQUEST:
			//     break;
			case GET_EXPERIMENT_PARAM_REQUEST_SUCCESS:
				draft.algorithm_name = action.payload.algorithm_name;
				draft.algorithm_size = action.payload.algorithm_size;
				draft.preset_name = action.payload.preset_name;
				draft.params = action.payload.params;
				break;
			// case GET_EXPERIMENT_PARAM_REQUEST_FAILURE:
			//     break;
			case SET_START_REQUEST:
				break;
			case SET_START_SUCCESS:
				draft.detail = action.payload;
				break;
			case SET_START_FAILURE:
				break;
			case INIT_DETAIL_REQUEST:
				draft.detail = {};
				break;
			default:
				return state;
		}
	});

export default reducer;
