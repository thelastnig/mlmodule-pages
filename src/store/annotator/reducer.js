import produce from '../produce';

export const LOAD_LIST_REQUEST = 'annotator/LOAD_LIST_REQUEST';
export const LOAD_LIST_SUCCESS = 'annotator/LOAD_LIST_SUCCESS';
export const LOAD_LIST_FAILURE = 'annotator/LOAD_LIST_FAILURE';
export const UPDATE_SORTING = 'annotator/UPDATE_SORTING';
export const INIT_DATA = 'annotator/INIT_DATA';

const getList = (data) => ({ type: LOAD_LIST_REQUEST, payload: data });
const getListSuccess = (data) => ({ type: LOAD_LIST_SUCCESS, payload: data });
const getListFailure = (error) => ({ type: LOAD_LIST_FAILURE, payload: error });
const updateSorting = (data) => ({ type: UPDATE_SORTING, payload: data });
const initData = (data) => ({ type: INIT_DATA, payload: data });

export const actions = {
	getList,
	getListSuccess,
	getListFailure,
	updateSorting,
	initData,
};

const initialState = {
	loadListLoading: false,
	loadListSuccess: false,
	loadListError: null,
	list: [],
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
				draft.list = [];
				break;
			case LOAD_LIST_SUCCESS:
				draft.loadListSuccess = true;
				draft.loadListError = null;
				let list = action.payload.list;
				list.map((item) => draft.list.push(item));
				break;
			case LOAD_LIST_FAILURE:
				draft.loadListSuccess = true;
				draft.loadListError = action.payload;
				draft.list = [];
				break;
			default:
				return state;
		}
	});

export default reducer;
