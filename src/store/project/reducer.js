import produce from '../produce';

export const LOAD_LIST_REQUEST = 'project/LOAD_LIST_REQUEST';
export const LOAD_LIST_SUCCESS = 'project/LOAD_LIST_SUCCESS';
export const LOAD_LIST_FAILURE = 'project/LOAD_LIST_FAILURE';
export const UPDATE_SELECT_PROJECT = 'project/UPDATE_SELECT_PROJECT';
export const UPDATE_SORTING = 'project/UPDATE_SORTING';
export const INIT_DATA = 'project/INIT_DATA';
export const CALL_GET_PROGRESS_STATUS_REQUEST = 'project/CALL_GET_PROGRESS_STATUS_REQUEST';
export const CALL_GET_PROGRESS_STATUS_SUCCESS = 'project/CALL_GET_PROGRESS_STATUS_SUCCESS';
export const CALL_GET_PROGRESS_STATUS_FAILURE = 'project/CALL_GET_PROGRESS_STATUS_FAILURE';

const loadProjectList = (data) => ({ type: LOAD_LIST_REQUEST, payload: data });
const loadProjectListSuccess = (data) => ({ type: LOAD_LIST_SUCCESS, payload: data });
const loadProjectListFailure = (error) => ({ type: LOAD_LIST_FAILURE, payload: error });
const updateSelectProject = (data) => ({ type: UPDATE_SELECT_PROJECT, payload: data });
const updateSorting = (data) => ({ type: UPDATE_SORTING, payload: data });
const initData = (data) => ({ type: INIT_DATA, payload: data });
const callGetProgressStatus = (data) =>({type:CALL_GET_PROGRESS_STATUS_REQUEST, payload:data});
const callGetProgressStatusSuccess = (data) => ({type:CALL_GET_PROGRESS_STATUS_SUCCESS, payload: data});
const callGetProgressStatusFailure = (error) => ({type: CALL_GET_PROGRESS_STATUS_FAILURE, payload: error});


export const actions = {
	callGetProgressStatus,
	callGetProgressStatusSuccess,
	callGetProgressStatusFailure,
	loadProjectList,
	loadProjectListSuccess,
	loadProjectListFailure,
	updateSelectProject,
	updateSorting,
	initData,
};

const initialState = {
	loadListLoading: false,
	loadListSuccess: false,
	loadListError: null,
	list: [],
	counts: {
		total: 0,
		ready: 0,
		working: 0,
		completed: 0,
	},
	row_count: 8,
	total_row_count: -1,
	sorting: 'create_date',
	sorting_type: false, //true:'asc', false:'desc'
	status:null,
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case CALL_GET_PROGRESS_STATUS_REQUEST:
				console.log('CALL_TEST_REQUEST');
				break;
			case CALL_GET_PROGRESS_STATUS_SUCCESS:
				draft.status = action.payload.status;
				break;
			case CALL_GET_PROGRESS_STATUS_FAILURE:
				break;
			case INIT_DATA:
				draft.sorting = 'create_date';
				draft.sorting_type = false;
				break;
			case UPDATE_SORTING:
				draft.sorting = action.payload.sorting;
				draft.sorting_type = action.payload.sorting_type;
				break;
			case LOAD_LIST_REQUEST:
				draft.loadListSuccess = false;
				draft.loadListError = null;
				draft.list = [];
				draft.total_row_count = -1;
				break;
			case LOAD_LIST_SUCCESS:
				console.log('LOAD_LIST_SUCCESS');
				draft.loadListSuccess = true;
				draft.loadListError = null;
				let list = action.payload.list;
				draft.total_row_count = action.payload.total_row_count;
				list.map((item) => draft.list.push(item));
				let counts = {
					total: action.payload.total,
					completed: action.payload.completed,
					ready: action.payload.ready,
					working: action.payload.working,
				};
				draft.counts = counts;
				break;
			case LOAD_LIST_FAILURE:
				draft.loadListSuccess = true;
				draft.loadListError = action.payload;
				draft.list = [];
				draft.total_row_count = 0;
				break;
			default:
				return state;
		}
	});

export default reducer;
