import produce from '../produce';

export const GET_REGISTERED_MODEL_VERSION_LIST = 'registered_models/GET_REGISTERED_MODEL_VERSION_LIST';
export const GET_REGISTERED_MODEL_VERSION_LIST_SUCCESS = 'registered_models/GET_REGISTERED_MODEL_VERSION_LIST_SUCCESS';
export const GET_REGISTERED_MODEL_VERSION_LIST_FAIL = 'registered_models/GET_REGISTERED_MODEL_VERSION_LIST_FAIL';
export const UPDATE_SORTING = 'registered_models/REGISTERED_MODEL_UPDATE_SORTING';
export const INIT_DATA = 'registered_models/REGISTERED_MODEL_INIT_DATA';

const getRegisteredModelVersionList = (data) => ({ type: GET_REGISTERED_MODEL_VERSION_LIST, payload: data });
const getRegisteredModelVersionListSuccess = (data) => ({ type: GET_REGISTERED_MODEL_VERSION_LIST_SUCCESS, payload: data });
const getRegisteredModelVersionListFail = (data) => ({ type: GET_REGISTERED_MODEL_VERSION_LIST_FAIL, payload: data });
const updateSorting = (data) => ({ type: UPDATE_SORTING, payload: data });
const initData = (data) => ({ type: INIT_DATA, payload: data });

export const actions = {
	getRegisteredModelVersionList,
	getRegisteredModelVersionListSuccess,
	getRegisteredModelVersionListFail,
	updateSorting,
	initData,
};

const initialState = {
	loadListLoading: false,
	loadListSuccess: false,
	loadListError: null,
	list: [],
	row_count: 5,
	total_row_count: 0,
	sorting: 'update_date',
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
				draft.sorting = 'update_date';
				draft.sorting_type = false;
				break;
			case GET_REGISTERED_MODEL_VERSION_LIST:
				draft.loadListSuccess = false;
				draft.loadListError = null;
				draft.list = [];
				break;
			case GET_REGISTERED_MODEL_VERSION_LIST_SUCCESS:
				draft.loadListSuccess = true;
				draft.loadListError = null;
				let list = action.payload.list;
				list.map((item) => draft.list.push(item));
				draft.total_row_count = action.payload.total_row_count;
				break;
			case GET_REGISTERED_MODEL_VERSION_LIST_FAIL:
				draft.loadListSuccess = true;
				draft.loadListError = action.payload;
				draft.list = [];
				break;
			default:
				return state;
		}
	});

export default reducer;
