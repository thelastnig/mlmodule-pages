import produce from '../produce';

export const LOAD_LIST_REQUEST = 'models/LOAD_LIST_REQUEST';
export const LOAD_LIST_SUCCESS = 'models/LOAD_LIST_SUCCESS';
export const LOAD_LIST_FAILURE = 'models/LOAD_LIST_FAILURE';
export const LOAD_MODEL_DETAIL = 'models/LOAD_MODEL_DETAIL';
export const LOAD_MODEL_DETAIL_SUCCESS = 'models/LOAD_MODEL_DETAIL_SUCCESS';
export const LOAD_MODEL_DETAIL_FAILURE = 'models/LOAD_MODEL_DETAIL_FAILURE';
export const INIT_MODEL_DETAIL_REQUEST = 'models/detail/INIT_MODEL_DETAIL_REQUEST';
export const LOAD_MODEL_VERSION_DETAIL = 'models/LOAD_MODEL_VERSION_DETAIL';
export const LOAD_MODEL_VERSION_DETAIL_SUCCESS = 'models/LOAD_MODEL_VERSION_DETAIL_SUCCESS';
export const INIT_MODEL_VERSION_DETAIL_REQUEST = 'models/detail/INIT_MODEL_DETAIL_REQUEST';
export const UPDATE_SORTING = 'models/UPDATE_SORTING';
export const INIT_DATA = 'models/TEMPLATE_INIT_DATA';

const loadModelsList = (data) => ({ type: LOAD_LIST_REQUEST, payload: data });
const loadModelsListSuccess = (data) => ({ type: LOAD_LIST_SUCCESS, payload: data });
const loadModelsListFailure = (error) => ({ type: LOAD_LIST_FAILURE, payload: error });
const loadModelDetail = (data) => ({ type: LOAD_MODEL_DETAIL, payload: data });
const loadModelDetailSuccess = (data) => ({ type: LOAD_MODEL_DETAIL_SUCCESS, payload: data });
const loadModelDetailFailure = (error) => ({ type: LOAD_MODEL_DETAIL_FAILURE, payload: error });
const initModelDetail = (data) => ({ type: INIT_MODEL_DETAIL_REQUEST, payload: data });
const loadModelVersionDetail = (data) => ({ type: LOAD_MODEL_VERSION_DETAIL, payload: data });
const loadModelVersionDetailSuccess = (data) => ({ type: LOAD_MODEL_VERSION_DETAIL_SUCCESS, payload: data });
const initModelVersionDetail = (data) => ({ type: INIT_MODEL_VERSION_DETAIL_REQUEST, payload: data });
const updateSorting = (data) => ({ type: UPDATE_SORTING, payload: data });
const initData = (data) => ({ type: INIT_DATA, payload: data });
export const actions = {
	loadModelsList,
	loadModelsListSuccess,
	loadModelsListFailure,
	loadModelDetail,
	loadModelDetailSuccess,
	loadModelDetailFailure,
	initModelDetail,
	loadModelVersionDetail,
	loadModelVersionDetailSuccess,
	initModelVersionDetail,
	updateSorting,
	initData,
};

const initialState = {
	loadListLoading: false,
	loadListSuccess: false,
	loadListError: null,
	registered_model_list: [],
	detail: {},
	version_info: {},
	row_count: 11,
	total_row_count: -1,
	sorting: 'create_date',
	sorting_type: false, //true:'asc', false:'desc'
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
				draft.registered_model_list = [];
				draft.total_row_count = -1;
				break;
			case LOAD_LIST_SUCCESS:
				draft.loadListSuccess = true;
				draft.loadListError = null;
				let list = action.payload.list;
				list.map((item) => draft.registered_model_list.push(item));
				draft.total_row_count = action.payload.total_row_count;
				break;
			case LOAD_LIST_FAILURE:
				draft.loadListSuccess = true;
				draft.loadListError = action.payload;
				draft.registered_model_list = [];
				draft.total_row_count = -1;
				break;
			case LOAD_MODEL_DETAIL:
				draft.loadDetailSuccess = false;
				draft.loadDetailError = null;
				draft.detail = {};
				break;
			case LOAD_MODEL_DETAIL_SUCCESS:
				draft.loadDetailSuccess = true;
				draft.loadDetailError = null;
				draft.detail = action.payload;
				break;
			case LOAD_MODEL_DETAIL_FAILURE:
				draft.loadDetailSuccess = false;
				draft.loadDetailError = action.payload;
				draft.detail = {};
				draft.version_list = [];
				break;
			case LOAD_MODEL_VERSION_DETAIL:
				break;
			case LOAD_MODEL_VERSION_DETAIL_SUCCESS:
				draft.version_info = action.payload;
				break;
			case INIT_MODEL_VERSION_DETAIL_REQUEST:
				draft.version_info = {};
				break;
			default:
				return state;
		}
	});

export default reducer;
