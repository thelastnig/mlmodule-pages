import produce from '../produce';

export const GET_LIST = 'usergroup/GET_LIST';
export const GET_LIST_SUCCESS = 'usergroup/GET_LIST_SUCCESS';
export const GET_LIST_FAILURE = 'usergroup/GET_LIST_FAILURE';
export const INIT_DATA = 'usergroup/INIT_DATA';
export const UPDATE_SORTING = 'usergroup/UPDATE_SORTING';
export const SET_INIT_TAP_TYPE = 'usergroup/SET_INIT_TAP_TYPE';

const getList = (data) => ({ type: GET_LIST, payload: data });
const getListSuccess = (data) => ({ type: GET_LIST_SUCCESS, payload: data });
const getListFailure = (error) => ({ type: GET_LIST_FAILURE, payload: error });
const initData = (data) => ({ type: INIT_DATA, payload: data });
const updateSorting = (data) => ({ type: UPDATE_SORTING, payload: data });
const setInitTabType = (data) => ({ type: SET_INIT_TAP_TYPE, payload: data });

export const actions = {
	getList,
	getListSuccess,
	getListFailure,
	initData,
	updateSorting,
	setInitTabType,
};

const ROW_COUNT_IN_A_PAGE = 11;

const initialState = {
	loadListLoading: false,
	loadListSuccess: false,
	loadListError: null,
	list: [],
	row_count: ROW_COUNT_IN_A_PAGE,
	total_row_count: -1,
	sorting: 'create_date',
	sorting_type: false, //true:'asc', false:'desc'
	initTabType: 'U',
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case INIT_DATA:
				draft.sorting = 'create_date';
				draft.sorting_type = false;
				draft.initTabType = 'U';
				break;
			case UPDATE_SORTING:
				draft.sorting = action.payload.sorting;
				draft.sorting_type = action.payload.sorting_type;
				break;
			case GET_LIST:
				draft.loadListSuccess = false;
				draft.loadListError = null;
				draft.list = [];
				draft.total_row_count = -1;
				break;
			case GET_LIST_SUCCESS:
				draft.loadListSuccess = true;
				draft.loadListError = null;
				let list = action.payload.list;
				list.map((item) => draft.list.push(item));
				draft.total_row_count = action.payload.total_row_count;
				break;
			case GET_LIST_FAILURE:
				draft.loadListSuccess = true;
				draft.loadListError = action.payload;
				draft.list = [];
				draft.total_row_count = -1;
				break;
			case SET_INIT_TAP_TYPE:
				draft.initTabType = action.payload;
				break;
			default:
				return state;
		}
	});

export default reducer;
