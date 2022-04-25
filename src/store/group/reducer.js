import produce from '../produce';

export const LOAD_GROUP_LIST = 'group/LOAD_GROUP_LIST';
export const LOAD_GROUP_LIST_SUCCESS = 'group/LOAD_GROUP_LIST_SUCCESS';
export const LOAD_GROUP_LIST_FAILURE = 'group/LOAD_GROUP_LIST_FAILURE';
export const INIT_DATA = 'group/INIT_DATA';
export const UPDATE_SORTING = 'group/UPDATE_SORTING';

const loadGroupList = (data) => ({ type: LOAD_GROUP_LIST, payload: data });
const loadGroupListSuccess = (data) => ({ type: LOAD_GROUP_LIST_SUCCESS, payload: data });
const loadGroupListFailure = (error) => ({ type: LOAD_GROUP_LIST_FAILURE, payload: error });
const initData = (data) => ({ type: INIT_DATA, payload: data });
const updateSorting = (data) => ({ type: UPDATE_SORTING, payload: data });

export const actions = {
	loadGroupList,
	loadGroupListSuccess,
	loadGroupListFailure,
	initData,
	updateSorting,
};

const ROW_COUNT_IN_A_PAGE = 11;

const initialState = {
	loadListLoading: false,
	loadListSuccess: false,
	loadListError: null,
	group_list: [],
	row_count: ROW_COUNT_IN_A_PAGE,
	total_row_count: -1,
	sorting: 'create_date',
	sorting_type: false, //true:'asc', false:'desc'
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case INIT_DATA:
				draft.sorting = 'create_date';
				draft.sorting_type = false;
				break;
			case UPDATE_SORTING:
				draft.sorting = action.payload.sorting;
				draft.sorting_type = action.payload.sorting_type;
				break;
			case LOAD_GROUP_LIST:
				draft.loadListSuccess = false;
				draft.loadListError = null;
				draft.group_list = [];
				draft.total_row_count = -1;
				break;
			case LOAD_GROUP_LIST_SUCCESS:
				draft.loadListSuccess = true;
				draft.loadListError = null;
				let list = action.payload.list;
				list.map((item) => draft.group_list.push(item));
				draft.total_row_count = action.payload.total_row_count;
				break;
			case LOAD_GROUP_LIST_FAILURE:
				draft.loadListSuccess = true;
				draft.loadListError = action.payload;
				draft.group_list = [];
				draft.total_row_count = -1;
				break;
			default:
				return state;
		}
	});

export default reducer;
