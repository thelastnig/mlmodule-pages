import produce from '../produce';

export const LOAD_LIST_REQUEST = 'template/LOAD_LIST_REQUEST';
export const LOAD_LIST_SUCCESS = 'template/LOAD_LIST_SUCCESS';
export const LOAD_LIST_FAILURE = 'template/LOAD_LIST_FAILURE';
export const TEMPLATE_UPDATE_SORTING = 'template/UPDATE_SORTING';
export const TEMPLATE_INIT_DATA = 'template/TEMPLATE_INIT_DATA';
export const UPDATE_EXPERIMENT_ID = 'template/UPDATE_EXPERIMENT_ID';
export const GET_TEMPLATE_DETAIL_REQUEST = 'template/GET_TEMPLATE_DETAIL_REQUEST';
export const GET_TEMPLATE_DETAIL_SUCCESS = 'template/GET_TEMPLATE_DETAIL_SUCCESS';
export const GET_TEMPLATE_DETAIL_FAIL = 'template/GET_TEMPLATE_DETAIL_FAIL';
export const INIT_DETAIL = 'template/INIT_DETAIL';

const getTemplateList = (data) => ({ type: LOAD_LIST_REQUEST, payload: data });
const getTemplateListSuccess = (data) => ({ type: LOAD_LIST_SUCCESS, payload: data });
const getTemplateListFailure = (error) => ({ type: LOAD_LIST_FAILURE, payload: error });
const updateSorting = (data) => ({ type: TEMPLATE_UPDATE_SORTING, payload: data });
const updateExperimentId = (data) => ({ type: UPDATE_EXPERIMENT_ID, payload: data });
const initData = (data) => ({ type: TEMPLATE_INIT_DATA, payload: data });
const getTemplateDetail = (data) => ({ type: GET_TEMPLATE_DETAIL_REQUEST, payload: data });
const getTemplateDetailSuccess = (data) => ({ type: GET_TEMPLATE_DETAIL_SUCCESS, payload: data });
const getTemplateDetailFail = (data) => ({ type: GET_TEMPLATE_DETAIL_FAIL, payload: data });
const initTemplateDetail = (data) => ({ type: INIT_DETAIL, payload: data });

export const actions = {
	getTemplateList,
	getTemplateListSuccess,
	getTemplateListFailure,
	updateSorting,
	updateExperimentId,
	initData,
	getTemplateDetail,
	initTemplateDetail,
	getTemplateDetailSuccess,
	getTemplateDetailFail,
};

const ROW_COUNT_IN_A_PAGE = 11;

const initialState = {
	loadListLoading: false,
	loadListSuccess: false,
	loadListError: null,
	experiment_id: '', // template list에서 맨 마지막에 선택된 항목의 experiment_id
	list: [],
	detail: '',
	row_count: ROW_COUNT_IN_A_PAGE,
	total_row_count: -1,
	sorting: 'create_date',
	sorting_type: false, //true:'asc', false:'desc'
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case TEMPLATE_UPDATE_SORTING:
				draft.sorting = action.payload.sorting;
				draft.sorting_type = action.payload.sorting_type;
				break;
			case UPDATE_EXPERIMENT_ID:
				draft.experiment_id = action.payload;
				break;
			case TEMPLATE_INIT_DATA:
				draft.experiment_id = '';
				draft.sorting = 'create_date';
				draft.sorting_type = false;
				draft.detail = '';
				break;
			case INIT_DETAIL:
				draft.detail = '';
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
				break;
			case LOAD_LIST_FAILURE:
				draft.loadListSuccess = true;
				draft.loadListError = action.payload;
				draft.list = [];
				draft.total_row_count = 0;
				break;
			case GET_TEMPLATE_DETAIL_REQUEST:
				draft.detail = '';
				break;
			case GET_TEMPLATE_DETAIL_FAIL:
				draft.detail = '';
				break;
			case GET_TEMPLATE_DETAIL_SUCCESS:
				draft.detail = action.payload;
				break;
			default:
				return state;
		}
	});

export default reducer;
